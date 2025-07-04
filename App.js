import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { Button, StyleSheet, View, Text } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useState } from "react";

export default function App() {
  const [pickedVideo, setPickedVideo] = useState(null);
  const [status, request] = ImagePicker.useMediaLibraryPermissions();
  const [status2, request2] = MediaLibrary.usePermissions();

  return (
    <View style={styles.container}>
      {pickedVideo && (
        <>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Video asset={pickedVideo} />
            <View
              style={{
                position: "absolute",
                borderColor: "red",
                borderWidth: 2,
                aspectRatio: pickedVideo.width / pickedVideo.height,
                ...(pickedVideo.width > pickedVideo.height
                  ? { width: 300 }
                  : { height: 300 }),
              }}
            />
          </View>
          <Text>
            Width: {pickedVideo?.width} x Height: {pickedVideo?.height}
          </Text>
        </>
      )}
      <Button
        title="Pick video"
        onPress={async () => {
          if (!status.granted) {
            await request();
          }
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            preferredAssetRepresentationMode:
              ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
          }).catch(console.error);

          if (res?.assets) {
            setPickedVideo(res.assets[0]);
          }
        }}
      />
      <Button
        title="Save and re-read w/ expo-media-library"
        onPress={async () => {
          if (!status2.granted) {
            await request2();
          }

          const create = await MediaLibrary.createAssetAsync(pickedVideo.uri);

          setPickedVideo(null);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          setPickedVideo(create);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function Video({ asset }) {
  const player = useVideoPlayer(asset.uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return <VideoView player={player} style={styles.video} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  video: {
    width: 300,
    height: 300,
  },
});
