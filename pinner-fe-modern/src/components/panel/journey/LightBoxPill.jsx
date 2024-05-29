import React from 'react';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

import Lightbox from 'yet-another-react-lightbox';
import { Fullscreen, Thumbnails, Zoom } from 'yet-another-react-lightbox/plugins';

export default function LightBoxPill({ photo, open, setOpen }) {
  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      slides={photo}
      plugins={[Fullscreen, Thumbnails, Zoom]}
      zoom={{ disabled: true }}
    />
  );
}
