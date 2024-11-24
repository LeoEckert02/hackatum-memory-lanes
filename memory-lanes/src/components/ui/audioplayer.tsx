import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AudioPlayer = ({ audioSrc, germanSRTUrl, englishSRTUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState('de');
  const [subtitles, setSubtitles] = useState([]);
  const [activeSubtitles, setActiveSubtitles] = useState([]); // Active subtitles state
  const audioRef = useRef(null);
  const subtitleRefs = useRef([]);

  useEffect(() => {
    // Fetch and parse SRT file from URL
    const fetchAndParseSRT = async (url) => {
      try {
        const response = await fetch(url);
        const srtText = await response.text();
        const parser = (await import('subtitles-parser-vtt')).default;
        const data = parser.fromVtt(srtText); // Parse SRT to JSON
        return data.map((item) => ({
          startTime: parseSRTTime(item.startTime), // Parse startTime
          endTime: parseSRTTime(item.endTime), // Parse endTime
          text: item.text,
        }));
      } catch (error) {
        console.error('Error fetching or parsing subtitles:', error);
        return [];
      }
    };

    // Load subtitles based on the selected language
    const loadSubtitles = async () => {
      const url = language === 'de' ? englishSRTUrl : germanSRTUrl;
      const parsedSubtitles = await fetchAndParseSRT(url);
      setSubtitles(parsedSubtitles);
    };

    loadSubtitles();
  }, [language, germanSRTUrl, englishSRTUrl]);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Cleanup
    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioSrc]);

  // Derive active subtitles based on currentTime
  useEffect(() => {
    const active = subtitles.filter(
      (subtitle) => currentTime >= subtitle.startTime && currentTime < subtitle.endTime
    );
    setActiveSubtitles(active);

    // Scroll active subtitle into view
    if (active.length > 0 && subtitleRefs.current[active[0].startTime]) {
      subtitleRefs.current[active[0].startTime].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, subtitles]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value) => {
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'de' ? 'en' : 'de'));
  };

  return (
    <div className="border-2 border-slate-900 rounded-xl p-4 pt-1 pb-1">
      <div className="flex items-center gap-6">
        <Button
          variant='outline'
          size="icon"
          onClick={togglePlay}
          className="h-12 w-12 hover:bg-slate-100 border-slate-900 bg-white! border-2"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-slate-900" />
          ) : (
            <Play className="h-6 w-6 text-slate-900" />
          )}
        </Button>

        <div className="flex-1 py-2">
          <div className="space-y-2 pt-6">
            <Slider
              defaultValue={[]}
              max={duration}
              step={1}
              value={[currentTime]}
              onValueChange={handleTimeChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 h-12 px-4 hover:bg-slate-100 border-slate-900 border-2"
        >
          <span>{language.toUpperCase()}</span>
        </Button>
      </div>

      <div className="my-3 h-48 overflow-y-auto bg-gray-100 p-4 rounded-md border">
        {subtitles.map((subtitle, index) => {
          const isActive = currentTime >= subtitle.startTime && currentTime < subtitle.endTime;
          return (
            <div
              key={index}
              ref={(el) => {
                subtitleRefs.current[subtitle.startTime] = el;
              }}
              className={`text-sm py-1 ${isActive ? 'text-black font-bold' : 'text-gray-500'}`}
            >
              {subtitle.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS
const formatTime = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to parse SRT time format (HH:MM:SS,SSS) into seconds
const parseSRTTime = (timeString) => {
  const [time, milliseconds] = timeString.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds) / 1000;
};

export default AudioPlayer;
