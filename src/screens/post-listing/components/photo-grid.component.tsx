import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
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
// Tách thành component riêng để gesture object ổn định, không tạo lại mỗi render

type PhotoCellProps = {
  photo: PhotoItem;
  index: number;
  cellSize: number;
  isCover: boolean;
  isDragSource: boolean;
  isDropTarget: boolean;
  onRemove: (id: string) => void;
  ghostX: Animated.SharedValue<number>;
  ghostY: Animated.SharedValue<number>;
  isDraggingShared: Animated.SharedValue<boolean>;
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
  const longPress = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(250)
        .onStart((e) => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          isDraggingShared.value = true;
          runOnJS(onLongPressStart)(index, e.absoluteX, e.absoluteY);
        }),
    // index không đổi trong vòng đời của cell này
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(250)
        .onUpdate((e) => {
          'worklet';
          ghostX.value = e.absoluteX;
          ghostY.value = e.absoluteY;
          runOnJS(onPanUpdate)(e.absoluteX, e.absoluteY);
        })
        .onEnd((e) => {
          'worklet';
          isDraggingShared.value = false;
          runOnJS(onPanEnd)(e.absoluteX, e.absoluteY);
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
        style={{
          width: cellSize,
          height: cellSize,
          margin: GRID_GAP / 2,
          borderRadius: 12,
          overflow: 'hidden',
          opacity: isDragSource ? 0.25 : 1,
          borderWidth: isDropTarget ? 2.5 : 0,
          borderColor: isDropTarget ? COLORS.primary : 'transparent',
        }}
      >
        <Image
          source={{ uri: photo.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {isCover && !isDragSource && (
          <View
            style={{
              position: 'absolute',
              bottom: 6,
              left: 6,
              backgroundColor: 'rgba(39,79,56,0.82)',
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
              Ảnh bìa
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => onRemove(photo.id)}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 99,
            padding: 2,
          }}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <XMarkIcon size={14} color="white" />
        </TouchableOpacity>
      </View>
    </GestureDetector>
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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Shared values — readable từ worklet (UI thread)
  const ghostX = useSharedValue(0);
  const ghostY = useSharedValue(0);
  const gridOriginX = useSharedValue(0);
  const gridOriginY = useSharedValue(0);
  const isDraggingShared = useSharedValue(false);

  // Ref cho JS-side calculations (getHoveredIndex)
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

  function handleLongPressStart(index: number, absX: number, absY: number) {
    measureGrid(); // refresh — user có thể đã scroll
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
    const from = dragIndex;
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

    setDragIndex(null);
    setHoverIndex(null);
    onDragEnd();
  }

  // Ghost theo ngón tay, nổi lên trên toàn bộ grid
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
    <View ref={gridRef} onLayout={measureGrid} style={{ position: 'relative' }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -(GRID_GAP / 2),
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
              hoverIndex === index &&
              dragIndex !== null &&
              dragIndex !== index
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

        {/* Nút thêm ảnh */}
        {photos.length < MAX_PHOTOS && (
          <TouchableOpacity
            onPress={onAdd}
            style={{
              width: cellSize,
              height: cellSize,
              margin: GRID_GAP / 2,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: COLORS.outlineVariant,
              borderStyle: 'dashed',
              backgroundColor: COLORS.surface,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              shadowColor: COLORS.onSurface,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            <CameraIcon size={22} color={COLORS.secondary} />
            <Text style={{ fontSize: 11, color: COLORS.secondary, fontWeight: '500' }}>
              Thêm ảnh
            </Text>
          </TouchableOpacity>
        )}

        {/* Ô trống placeholder */}
        {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length - 1) }).map(
          (_, i) => (
            <View
              key={`empty-${i}`}
              style={{
                width: cellSize,
                height: cellSize,
                margin: GRID_GAP / 2,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.outlineVariant,
                borderStyle: 'dashed',
                backgroundColor: COLORS.surfaceContainer,
              }}
            />
          ),
        )}
      </View>

      {/* Ghost — ảnh nổi theo ngón tay khi kéo */}
      {dragIndex !== null && photos[dragIndex] && (
        <Animated.View style={ghostStyle} pointerEvents="none">
          <Image
            source={{ uri: photos[dragIndex].uri }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
            resizeMode="cover"
          />
        </Animated.View>
      )}

      <Text style={{ fontSize: 12, color: COLORS.secondary, marginTop: 8 }}>
        Giữ và kéo để sắp xếp · Ảnh đầu là ảnh bìa · Tối đa 6 ảnh
      </Text>
    </View>
  );
}
