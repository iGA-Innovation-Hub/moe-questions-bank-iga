import { OutputFormat, PollyClient, SynthesizeSpeechCommand, VoiceId } from "@aws-sdk/client-polly";
import { Readable } from "stream";

const pollyClient = new PollyClient({});

export async function handler(event: { body: string }) {
  const bucketName = process.env.BUCKET_NAME;
  console.log("Bucket Name: " + process.env.BUCKET_NAME);

  const data = JSON.parse(event.body);
  const audioName = data.audioName;
  const script = data.script;

  try {
    const pollyParams = {
      Text: script,
      OutputFormat: OutputFormat.MP3,
      VoiceId: VoiceId.Joanna,
    };
    console.log(`pollyParams: ${pollyParams}`);
    const synthesizeSpeechCommand = new SynthesizeSpeechCommand(pollyParams);
    const pollyResponse = await pollyClient.send(synthesizeSpeechCommand);
    

    if (!pollyResponse.AudioStream) {
      throw new Error("Failed to generate audio from Polly");
    }

    // Convert the AudioStream to a buffer
    const audioBuffer = await streamToBuffer(pollyResponse.AudioStream as Readable);

    console.log("Audio generation successful");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioData: audioBuffer.toString("base64"),
        audioName: audioName,
      }),
    };
    
  } catch (error: any) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to generate audio!" }),
    };
  }
}



const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
};


