import whisper
import ssl

ssl._create_default_https_context = ssl._create_unverified_context


# Function to write SRT file
def write_srt(segments, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments):
            start = format_timestamp(segment["start"])
            end = format_timestamp(segment["end"])
            text = segment["text"]

            # SRT Format: index, start --> end, text
            f.write(f"{i + 1}\n")
            f.write(f"{start} --> {end}\n")
            f.write(f"{text}\n\n")


# Function to format timestamps for SRT (HH:MM:SS,ms)
def format_timestamp(seconds):
    hours, remainder = divmod(int(seconds), 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{int(seconds):02},{milliseconds:03}"


# We use the turbo model
model = whisper.load_model("turbo")
audio_file = "gutmann.m4a"

# German transcription
result_german = model.transcribe(audio_file, language="de")
write_srt(result_german["segments"], "german_transcription.srt")

# English translation
result_translation = model.transcribe(audio_file, task="translate")
write_srt(result_translation["segments"], "english_translation.srt")

print("Transcriptions saved as 'german_transcription.srt' and 'english_translation.srt'")
