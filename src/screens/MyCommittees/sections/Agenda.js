import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, Text } from 'react-native';
import { useTheme } from '../../../theme';
import useMeetingEditor from '../../../hooks/useMeetingEditor';
import MeetingEditor from '../components/MeetingEditor';
import MeetingPreview from '../components/MeetingPreview';
import MeetingListItem from '../components/MeetingListItem';

export default function AgendaSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const controller = useMeetingEditor({ committeeId });
  const windowWidth = Dimensions.get('window').width;
  const previewHeight = Math.round(windowWidth * (297 / 210));

  const headerElement = useMemo(() => (
    <>
      <MeetingEditor controller={controller} canEdit={canEdit} />
      <MeetingPreview controller={controller} previewHeight={previewHeight} />
    </>
  ), [controller, canEdit, previewHeight]);

  return (
    <View>
      <FlatList
        data={controller.items}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={headerElement}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No items yet.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <MeetingListItem item={item} membersList={controller.membersList} canEdit={canEdit} beginEdit={controller.beginEdit} deleteItem={controller.deleteItem} />
        )}
      />
    </View>
  );
}
