import React from 'react';
import { Marker, MarkerPressEvent } from 'react-native-maps';
import { Place } from '@/types';
import { IconSymbol, IconSymbolName } from '../ui/IconSymbol';
import { Colors } from '@/constants/Colors';

// This mapping connects Google Place types to SF Symbol names.
const PLACE_TYPE_TO_ICON: Record<string, IconSymbolName> = {
  restaurant: 'fork.knife',
  cafe: 'cup.and.saucer.fill',
  bar: 'wineglass.fill',
  park: 'leaf.fill',
  museum: 'building.columns.fill',
  tourist_attraction: 'camera.fill',
  lodging: 'house.fill',
  store: 'cart.fill',
  bakery: 'birthday.cake.fill',
  art_gallery: 'photo.on.rectangle.angled',
  point_of_interest: 'mappin.and.ellipse',
  establishment: 'mappin.and.ellipse',
  default: 'mappin.and.ellipse',
};

interface MapMarkerProps {
  place: Place;
  onPress: () => void;
  isSelected: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({ place, onPress, isSelected }) => {
  const handlePress = (e: MarkerPressEvent) => {
    e.stopPropagation();
    onPress();
  };

  const getIconName = (): IconSymbolName => {
    // Use the first type from the place's types array, or 'default'
    const placeType = place.types?.[0] || 'default';
    return PLACE_TYPE_TO_ICON[placeType] || PLACE_TYPE_TO_ICON['default'];
  };

  return (
    <Marker coordinate={place.coord} onPress={handlePress}>
      <IconSymbol
        name={getIconName()}
        size={isSelected ? 40 : 30}
        color={isSelected ? Colors.light.tint : 'black'}
        />
    </Marker>
  );
};

export default MapMarker;