import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
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
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 40; // px-5 * 2

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
  // Refs giữ callback mới nhất — gesture (memo []) không bị stale closure
  const onLongPressStartRef = useRef(onLongPressStart);
  onLongPressStartRef.current = onLongPressStart;
  const onPanUpdateRef = useRef(onPanUpdate);
  onPanUpdateRef.current = onPanUpdate;
  const onPanEndRef = useRef(onPanEnd);
  onPanEndRef.current = onPanEnd;
  const indexRef = useRef(index);
  indexRef.current = index;

  // Stable wrappers — identity không đổi, delegate đến ref.current
  const stableLongPressStart = useCallback(
    (idx: number, ax: number, ay: number) => onLongPressStartRef.current(idx, ax, ay),
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
        .onStart((e) => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          isDraggingShared.value = true;
          runOnJS(stableLongPressStart)(indexRef.current, e.absoluteX, e.absoluteY);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(250)
        .onUpdate((e) => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          runOnJS(stablePanUpdate)(e.absoluteX, e.absoluteY);
        })
        .onEnd((e) => {
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

  const gesture = useMemo(() => Gesture.Simultaneous(longPress, pan), [longPress, pan]);

  return (
    <GestureDetector gesture={gesture}>
      {/* Outer: border ring (overflow visible để border không bị clip) */}
      <View
        style={[
          styles.cellOuter,
          { width: cellSize, height: cellSize },
          isDragSource && styles.cellDragging,
          isDropTarget && styles.cellDropTarget,
        ]}
      >
        {/* Inner: clip ảnh theo bo góc */}
        <View style={styles.cellInner}>
          <Image source={{ uri: photo.uri }} style={styles.cellImage} resizeMode="cover" />
          {isCover && !isDragSource && (
            <View style={styles.coverBadge}>
              <Text style={styles.coverText}>Bìa</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => onRemove(photo.id)}
            style={styles.removeBtn}
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

function DashedEmptyCell({ size, slotNumber }: { size: number; slotNumber: number }) {
  const r = 12;
  return (
    <View style={[styles.dashedCell, { width: size, height: size }]}>
      <Svg style={StyleSheet.absoluteFillObject} width={size} height={size}>
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
      <Text style={styles.slotLabel}>{slotNumber}/{MAX_PHOTOS}</Text>
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
  const cellSize =
    (windowWidth - HORIZONTAL_PADDING - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

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
    const relX = absX - gridOriginRef.current.x;
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
    <View ref={gridRef} onLayout={measureGrid} style={styles.container}>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <PhotoCell
            key={photo.id}
            photo={photo}
            index={index}
            cellSize={cellSize}
            isCover={index === 0}
            isDragSource={dragIndex === index}
            isDropTarget={hoverIndex === index && dragIndex !== null && dragIndex !== index}
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
            style={[styles.dashedCell, { width: cellSize, height: cellSize }]}
          >
            <Svg style={StyleSheet.absoluteFillObject} width={cellSize} height={cellSize}>
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
            <CameraIcon size={22} color={COLORS.secondary} />
            <Text style={styles.addText}>Thêm ảnh</Text>
          </TouchableOpacity>
        )}

        {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length - 1) }).map((_, i) => (
          <DashedEmptyCell
            key={`empty-${i}`}
            size={cellSize}
            slotNumber={photos.length + 2 + i}
          />
        ))}
      </View>

      {dragIndex !== null && photos[dragIndex] && (
        <Animated.View style={ghostStyle} pointerEvents="none">
          <Image source={{ uri: photos[dragIndex].uri }} style={styles.ghostImage} resizeMode="cover" />
        </Animated.View>
      )}

      <Text style={styles.hint}>
        Giữ và kéo để sắp xếp · Ảnh đầu là ảnh bìa · Tối đa 6 ảnh
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(GRID_GAP / 2),
  },
  // Outer: giữ border ring, không clip
  cellOuter: {
    borderRadius: 12,
    margin: GRID_GAP / 2,
  },
  // Inner: clip ảnh theo bo góc
  cellInner: {
    flex: 1,
    borderRadius: 10, // nhỏ hơn outer 2px để không tràn ra ngoài border
    overflow: 'hidden',
  },
  cellDragging: {
    opacity: 0.25,
  },
  cellDropTarget: {
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(39,79,56,0.82)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  coverText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 99,
    padding: 2,
  },
  addText: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '500',
    marginTop: 6,
  },
  dashedCell: {
    margin: GRID_GAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  ghostImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  hint: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 8,
  },
});
