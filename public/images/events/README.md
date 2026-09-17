# Event photos

Drop recap images here, one folder per event slug, e.g.

    public/images/events/couple-quiz-x-jam/jam-1.jpg

Then list them on the event in `lib/events.ts`:

    gallery: [
      { src: "/images/events/couple-quiz-x-jam/jam-1.jpg", alt: "Open mic in full swing" },
    ]

They render as a grid on that event's detail page. Keep images under ~500KB
each — they're served straight from /public.
