import React from 'react';

function About() {
  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Memory Lanes</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Memory Lanes is a platform that transforms Munich’s neighborhoods into
          a living museum of stories, directly narrated by the city's elders.
          It’s more than history; it’s connection, community, and a chance to
          walk through time. Explore the rich tapestry of experiences that bring
          Munich’s past to life, one story at a time.
        </p>
      </div>
    </section>
  );
}

export default React.memo(About);
