import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../../theme';

export default function MeetingPreview({ controller, previewHeight }) {
  const theme = useTheme();
  if (!controller) return null;
  const { previewVisible, previewHtml, webviewRef } = controller;
  if (!previewVisible) return null;

  return (
    <View style={{ width: '100%', height: previewHeight, marginBottom: theme.spacing.md, borderRadius: 8, overflow: "hidden" }} collapsable={false}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: previewHtml }}
        style={{ flex: 1 }}
        ref={webviewRef}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        scalesPageToFit={true}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
