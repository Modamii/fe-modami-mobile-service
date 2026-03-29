import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { CameraIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import type { PhotoItem } from '../hooks/usePostListingScreen';

const MAX_PHOTOS = 6;
const GRID_COLS = 3;
/** Khớp Home (`HOME_GRID_GAP`) — Tailwind `3` = 12px */
const GRID_GAP = 12;
/** px-5 × 2 — khớp `windowWidth - 40` trên Home */
const GRID_HORIZONTAL_PADDING = 40;

/**
 * Chiều rộng mỗi ô: (W − (cols−1)×gap) / cols — cùng `gap` trong style container.
 * Dùng `style={{ gap: GRID_GAP }}` (số px) thay vì class `gap-3` để khớp công thức, tránh lệch.
 */
function computeGridLayout(outerWidth: number): {
  cell: number;
  pl: number;
  pr: number;
} {
  const W = Math.max(0, outerWidth);
  const gapTotal = GRID_GAP * (GRID_COLS - 1);
  const cell = Math.floor((W - gapTotal) / GRID_COLS);
  const used = GRID_COLS * cell + gapTotal;
  const rem = W - used;
  const pl = Math.floor(rem / 2);
  const pr = rem - pl;
  return { cell, pl, pr };
}

// ─── PhotoCell ────────────────────────────────────────────────────────────────

type PhotoCellProps = {
  photo: PhotoItem;
  index: number;
  cellSize: number;
  isCover: boolean;
  isDragSource: boolean;
  isDropTarget: boolean;
  onRemove: (id: string) => void;
  ghostX: SharedValue<number>;
  ghostY: SharedValue<number>;
  isDraggingShared: SharedValue<boolean>;
  onLongPressStart: (index: number, absX: number, absY: number) => void;
  onPanUpdate: (absX: number, absY: number) => void;
  onPanEnd: (absX: number, absY: number) => void;
};

function PhotoCell({
  photo,
  index,
  cellSize,
  isCover,
  isDragSource,
  isDropTarget,
  onRemove,
  ghostX,
  ghostY,
  isDraggingShared,
  onLongPressStart,
  onPanUpdate,
  onPanEnd,
}: PhotoCellProps) {
  const onLongPressStartRef = useRef(onLongPressStart);
  onLongPressStartRef.current = onLongPressStart;
  const onPanUpdateRef = useRef(onPanUpdate);
  onPanUpdateRef.current = onPanUpdate;
  const onPanEndRef = useRef(onPanEnd);
  onPanEndRef.current = onPanEnd;
  const indexRef = useRef(index);
  indexRef.current = index;

  const stableLongPressStart = useCallback(
    (idx: number, ax: number, ay: number) =>
      onLongPressStartRef.current(idx, ax, ay),
    [],
  );
  const stablePanUpdate = useCallback(
    (ax: number, ay: number) => onPanUpdateRef.current(ax, ay),
    [],
  );
  const stablePanEnd = useCallback(
    (ax: number, ay: number) => onPanEndRef.current(ax, ay),
    [],
  );

  const longPress = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(250)
        .onStart(e => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          isDraggingShared.value = true;
          runOnJS(stableLongPressStart)(
            indexRef.current,
            e.absoluteX,
            e.absoluteY,
          );
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(250)
        .onUpdate(e => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          runOnJS(stablePanUpdate)(e.absoluteX, e.absoluteY);
        })
        .onEnd(e => {
          'worklet';
          isDraggingShared.value = false;
          runOnJS(stablePanEnd)(e.absoluteX, e.absoluteY);
        })
        .onFinalize(() => {
          'worklet';
          isDraggingShared.value = false;
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const gesture = useMemo(
    () => Gesture.Simultaneous(longPress, pan),
    [longPress, pan],
  );

  return (
    <GestureDetector gesture={gesture}>
      <View
        className={`rounded-xl ${isDragSource ? 'opacity-25' : ''} ${isDropTarget ? 'border-[2.5px] border-primary' : ''}`}
        style={{ width: cellSize, height: cellSize }}
      >
        <View className="flex-1 rounded-[10px] overflow-hidden">
          <Image
            source={{ uri: photo.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isCover && !isDragSource && (
            <View className="absolute bottom-1.5 left-1.5 rounded-md bg-primary/80 px-1.5 py-0.5">
              <Text className="text-[10px] font-semibold text-white">Bìa</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => onRemove(photo.id)}
            className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5"
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <XMarkIcon size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </GestureDetector>
  );
}

// ─── DashedEmptyCell ──────────────────────────────────────────────────────────

function DashedEmptyCell({
  size,
  slotNumber,
}: {
  size: number;
  slotNumber: number;
}) {
  const r = 12;
  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View className="absolute inset-0" pointerEvents="none">
        <Svg width={size} height={size}>
          <Rect
            x={1}
            y={1}
            width={size - 2}
            height={size - 2}
            rx={r}
            ry={r}
            fill={COLORS.surfaceContainer}
            stroke={COLORS.outlineVariant}
            strokeWidth={1}
            strokeDasharray="5,4"
          />
        </Svg>
      </View>
      <Text className="text-xs font-medium text-secondary">
        {slotNumber}/{MAX_PHOTOS}
      </Text>
    </View>
  );
}

// ─── PhotoGrid ────────────────────────────────────────────────────────────────

type Props = Readonly<{
  photos: PhotoItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onReorder: (photos: PhotoItem[]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}>;

export function PhotoGrid({
  photos,
  onAdd,
  onRemove,
  onReorder,
  onDragStart,
  onDragEnd,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [gridRowWidth, setGridRowWidth] = useState(0);
  const gridPadLeftRef = useRef(0);

  const gridMetrics = useMemo(() => {
    const W =
      gridRowWidth > 0
        ? gridRowWidth
        : Math.max(0, windowWidth - GRID_HORIZONTAL_PADDING);
    return computeGridLayout(W);
  }, [gridRowWidth, windowWidth]);

  const cellSize = gridMetrics.cell;

  useLayoutEffect(() => {
    gridPadLeftRef.current = gridMetrics.pl;
  }, [gridMetrics.pl]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const ghostX = useSharedValue(0);
  const ghostY = useSharedValue(0);
  const gridOriginX = useSharedValue(0);
  const gridOriginY = useSharedValue(0);
  const isDraggingShared = useSharedValue(false);

  const gridOriginRef = useRef({ x: 0, y: 0 });
  const gridRef = useRef<View>(null);

  function measureGrid() {
    gridRef.current?.measureInWindow((x, y) => {
      gridOriginRef.current = { x, y };
      gridOriginX.value = x;
      gridOriginY.value = y;
    });
  }

  function getHoveredIndex(absX: number, absY: number): number | null {
    const relX = absX - gridOriginRef.current.x - gridPadLeftRef.current;
    const relY = absY - gridOriginRef.current.y;
    const stride = cellSize + GRID_GAP;
    const col = Math.floor(relX / stride);
    const row = Math.floor(relY / stride);
    if (col < 0 || col >= GRID_COLS || row < 0) return null;
    const idx = row * GRID_COLS + col;
    return idx < photos.length ? idx : null;
  }

  function handleLongPressStart(index: number, _absX: number, _absY: number) {
    measureGrid();
    dragIndexRef.current = index;
    setDragIndex(index);
    setHoverIndex(index);
    onDragStart();
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }

  function handlePanUpdate(absX: number, absY: number) {
    setHoverIndex(getHoveredIndex(absX, absY));
  }

  function handlePanEnd(absX: number, absY: number) {
    const from = dragIndexRef.current;
    const to = getHoveredIndex(absX, absY);

    if (from !== null && to !== null && from !== to) {
      const next = [...photos];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onReorder(next);
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }

    dragIndexRef.current = null;
    setDragIndex(null);
    setHoverIndex(null);
    onDragEnd();
  }

  const ghostStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: cellSize,
    height: cellSize,
    left: ghostX.value - gridOriginX.value - cellSize / 2,
    top: ghostY.value - gridOriginY.value - cellSize / 2,
    zIndex: 999,
    borderRadius: 12,
    transform: [
      { scale: withSpring(isDraggingShared.value ? 1.1 : 1, { damping: 15 }) },
    ],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: isDraggingShared.value ? 0.28 : 0,
    shadowRadius: 20,
    elevation: 12,
    opacity: isDraggingShared.value ? 1 : 0,
  }));

  return (
    <View className="relative w-full">
      <View
        ref={gridRef}
        collapsable={false}
        className="w-full flex-row flex-wrap self-stretch"
        style={{
          gap: GRID_GAP,
          paddingLeft: gridMetrics.pl,
          paddingRight: gridMetrics.pr,
        }}
        onLayout={(e) => {
          setGridRowWidth(e.nativeEvent.layout.width);
          measureGrid();
        }}
      >
        {photos.map((photo, index) => (
          <PhotoCell
            key={photo.id}
            photo={photo}
            index={index}
            cellSize={cellSize}
            isCover={index === 0}
            isDragSource={dragIndex === index}
            isDropTarget={
              hoverIndex === index && dragIndex !== null && dragIndex !== index
            }
            onRemove={onRemove}
            ghostX={ghostX}
            ghostY={ghostY}
            isDraggingShared={isDraggingShared}
            onLongPressStart={handleLongPressStart}
            onPanUpdate={handlePanUpdate}
            onPanEnd={handlePanEnd}
          />
        ))}

        {photos.length < MAX_PHOTOS && (
          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.7}
            className="items-center justify-center"
            style={{ width: cellSize, height: cellSize }}
          >
            <View className="absolute inset-0" pointerEvents="none">
              <Svg width={cellSize} height={cellSize}>
                <Rect
                  x={1}
                  y={1}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  rx={12}
                  ry={12}
                  fill={COLORS.surface}
                  stroke={COLORS.outlineVariant}
                  strokeWidth={1}
                  strokeDasharray="5,4"
                />
              </Svg>
            </View>
            <CameraIcon size={22} color={COLORS.secondary} />
            <Text className="mt-1.5 text-[11px] font-medium text-secondary">
              Thêm ảnh
            </Text>
          </TouchableOpacity>
        )}

        {Array.from({
          length: Math.max(0, MAX_PHOTOS - photos.length - 1),
        }).map((_, i) => (
          <DashedEmptyCell
            key={`empty-${i}`}
            size={cellSize}
            slotNumber={photos.length + 2 + i}
          />
        ))}
      </View>

      {dragIndex !== null && photos[dragIndex] && (
        <Animated.View style={ghostStyle} pointerEvents="none">
          <Image
            source={{ uri: photos[dragIndex].uri }}
            className="h-full w-full rounded-xl"
            resizeMode="cover"
          />
        </Animated.View>
      )}

      <Text className="mt-2 text-xs text-secondary">
        Giữ và kéo để sắp xếp · Ảnh đầu là ảnh bìa · Tối đa 6 ảnh
      </Text>
    </View>
  );
}
