"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const reviews = [
  {
    name: "Joshua Ly",
    text: "I don’t usually write reviews, but Jeff’s Electric absolutely deserves it. From the moment I called, their team was professional, responsive, and genuinely cared about getting the job done right. They arrived on time, worked efficiently...",
  },
  {
    name: "Anthony Do",
    text: "I had a great experience with Jeff Electric! They did an amazing job from start to finish. They were professional, knowledgeable, efficient, and made sure everything was done right.",
  },
  {
    name: "Teresa Rainer",
    text: "Jeff and team were very professional. He called ahead and let me know when they would be at my home. They did a whole days work and were very efficient in all of the areas they worked on.",
  },
  {
    name: "Organic Spa Houston",
    text: "Jeff did an excellent job upgrading our breakers and installing our sauna. He’s a professional and honest person and we appreciate his honesty and quality work. Highly recommend him for all your electrical needs!",
  },
  {
    name: "Stephen Evans",
    text: "Jeff electric replace the electrical service at one of my investment properties, relocated the primary power to the exterior of the house and brought it up to code and replaced an old 1950’s federal pacific sub panel in the garage.",
  },
  {
    name: "Martin Flores",
    text: "Lost power to half of my house (underground line root damage) explained to Jeff wanted repair and upgrade existing breaker box as well.",
  },
  {
    name: "Mb H",
    text: "I like to give credit where it’s due, and boy was this a BIG ONE!!! Our lights had been going out on our 5year old pool till one day they didn’t turn on any more. Jeff was recommended by a friend so we gave him a call.",
  },
];

export default function ReviewsCarousel() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById("reviews"));
  }, []);

  if (!target) return null;

  return createPortal(
    <>
      <div className="review-carousel" aria-label="Google customer reviews">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote>“{review.text}”</blockquote>
            <footer><strong>{review.name}</strong><span>Google Review</span></footer>
          </article>
        ))}
      </div>
      <p className="review-hint">Swipe or scroll to read more reviews →</p>
    </>,
    target,
  );
}
