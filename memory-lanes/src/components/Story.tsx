import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PocketBase from 'pocketbase';
import PersonProfile from './ui/PersonProfile';

const url = 'https://memory-lanes.pockethost.io/';
const client = new PocketBase(url);

function Story() {
  const { id } = useParams(); // Access the dynamic `id` from the URL
  const [story, setStory] = useState(null); // State to hold the story data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state

  useEffect(() => {
    // Fetch the story data based on the `id`
    const fetchStory = async () => {
        setLoading(true);
        try {
          const record = await client.collection('pin_data').getOne(id);

          const fetchedLocation = {
            lat: record.lat,
            lng: record.long,
            firstname: record.firstname || 'Untitled Location',
            description: record.description || 'No description available.',
            landmark: record.landmark || 'No landmark available.',
            dob: record.dob || 'No date of birth available.',
            audioUrl: url + 'api/files/617adlmghe8iw4d/' + id + '/' + record.audio || 'No audio available.',
            germanSRTUrl: url + 'api/files/617adlmghe8iw4d/' + id + '/' + record.german_subtitles || 'No German subtitles available.',
            englishSRTUrl: url + 'api/files/617adlmghe8iw4d/' + id + '/' + record.eng_subtitles || 'No English subtitles available.',
          };

          console.log('Fetched location:', fetchedLocation);

          setStory(fetchedLocation);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

    fetchStory();
  }, [id]);

    // Add the current story ID to the `visited` list in localStorage
    const visited = JSON.parse(localStorage.getItem('visited')) || [];
    if (!visited.includes(id)) {
        visited.push(id);
        localStorage.setItem('visited', JSON.stringify(visited));
    }

  if (loading || !story) {
    return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="w-screen flex flex-col items-center">
        {/* Main Content */}
        <PersonProfile personData={story} />
    </div>
  );
}

export default React.memo(Story);
