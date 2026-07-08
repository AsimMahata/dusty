
import { Folder, Tv, FileCode2, Music, Video, Image as ImageIcon, Archive } from 'lucide-react';

const createIcon = (Icon: any) => <Icon size={24} />;

export const mockData = {
  Shows: {
    recent: [
      { id: '1', title: 'Breaking Bad', subtitle: 'Season 1-5', icon: createIcon(Tv), metadata: '62 Episodes', size: '124 GB' },
      { id: '2', title: 'Dark', subtitle: 'Season 1-3', icon: createIcon(Tv), metadata: '26 Episodes', size: '52 GB' },
      { id: '3', title: 'The Office', subtitle: 'Season 1-9', icon: createIcon(Tv), metadata: '201 Episodes', size: '85 GB' },
    ],
    all: [
      { id: '4', title: 'Attack on Titan', subtitle: 'Complete Series', icon: createIcon(Tv), metadata: '89 Episodes', size: '90 GB' },
      { id: '5', title: 'Stranger Things', subtitle: 'Season 1-4', icon: createIcon(Tv), metadata: '34 Episodes', size: '60 GB' },
      { id: '6', title: 'The Boys', subtitle: 'Season 1-3', icon: createIcon(Tv), metadata: '24 Episodes', size: '48 GB' },
      { id: '7', title: 'Succession', subtitle: 'Season 1-4', icon: createIcon(Tv), metadata: '39 Episodes', size: '45 GB' },
      { id: '8', title: 'Severance', subtitle: 'Season 1', icon: createIcon(Tv), metadata: '9 Episodes', size: '15 GB' },
    ]
  },
  Projects: {
    recent: [
      { id: 'p1', title: 'Dusty', subtitle: 'Rust / Tauri / React', icon: createIcon(FileCode2), metadata: 'Updated 2h ago', size: '156 MB' },
      { id: 'p2', title: 'Portfolio', subtitle: 'Next.js / Tailwind', icon: createIcon(FileCode2), metadata: 'Updated yesterday', size: '42 MB' },
      { id: 'p3', title: 'Compiler', subtitle: 'C++', icon: createIcon(FileCode2), metadata: 'Updated 3d ago', size: '12 MB' },
    ],
    all: [
      { id: 'p4', title: 'CP Templates', subtitle: 'C++ / Python', icon: createIcon(FileCode2), metadata: 'Updated 1w ago', size: '2 MB' },
      { id: 'p5', title: 'Traffic Model', subtitle: 'Python / Jupyter', icon: createIcon(FileCode2), metadata: 'Updated 1mo ago', size: '1.2 GB' },
      { id: 'p6', title: 'Discord Bot', subtitle: 'Node.js', icon: createIcon(FileCode2), metadata: 'Updated 3mo ago', size: '85 MB' },
    ]
  },
  Music: {
    recent: [
      { id: 'm1', title: 'Random Access Memories', subtitle: 'Daft Punk', icon: createIcon(Music), metadata: '13 Tracks', size: '142 MB' },
      { id: 'm2', title: 'The Dark Side of the Moon', subtitle: 'Pink Floyd', icon: createIcon(Music), metadata: '10 Tracks', size: '115 MB' },
      { id: 'm3', title: 'After Hours', subtitle: 'The Weeknd', icon: createIcon(Music), metadata: '14 Tracks', size: '130 MB' },
    ],
    all: [
      { id: 'm4', title: 'Currents', subtitle: 'Tame Impala', icon: createIcon(Music), metadata: '13 Tracks', size: '120 MB' },
      { id: 'm5', title: 'IGOR', subtitle: 'Tyler, The Creator', icon: createIcon(Music), metadata: '12 Tracks', size: '105 MB' },
      { id: 'm6', title: 'Blonde', subtitle: 'Frank Ocean', icon: createIcon(Music), metadata: '17 Tracks', size: '150 MB' },
      { id: 'm7', title: 'Discovery', subtitle: 'Daft Punk', icon: createIcon(Music), metadata: '14 Tracks', size: '140 MB' },
    ]
  },
  Videos: {
    recent: [
      { id: 'v1', title: 'Rust Masterclass', subtitle: 'Course', icon: createIcon(Video), metadata: '45 Videos', size: '12 GB' },
      { id: 'v2', title: 'Interstellar', subtitle: 'Movie', icon: createIcon(Video), metadata: '1080p', size: '3.5 GB' },
      { id: 'v3', title: 'Dune: Part Two', subtitle: 'Movie', icon: createIcon(Video), metadata: '4K HDR', size: '18 GB' },
    ],
    all: [
      { id: 'v4', title: 'React Performance', subtitle: 'Conference Talk', icon: createIcon(Video), metadata: '720p', size: '450 MB' },
      { id: 'v5', title: 'The Matrix', subtitle: 'Movie', icon: createIcon(Video), metadata: '1080p', size: '2.8 GB' },
      { id: 'v6', title: 'Blender Donut Tutorial', subtitle: 'Course', icon: createIcon(Video), metadata: '16 Videos', size: '4.2 GB' },
    ]
  },
  Images: {
    recent: [
      { id: 'i1', title: 'Japan Trip 2023', subtitle: 'Photography', icon: createIcon(ImageIcon), metadata: '452 Photos', size: '2.4 GB' },
      { id: 'i2', title: 'UI References', subtitle: 'Design', icon: createIcon(ImageIcon), metadata: '128 Images', size: '350 MB' },
      { id: 'i3', title: 'Wallpapers', subtitle: 'Collection', icon: createIcon(ImageIcon), metadata: '85 Images', size: '1.2 GB' },
    ],
    all: [
      { id: 'i4', title: 'Family Album', subtitle: 'Personal', icon: createIcon(ImageIcon), metadata: '890 Photos', size: '4.5 GB' },
      { id: 'i5', title: 'Textures', subtitle: 'Assets', icon: createIcon(ImageIcon), metadata: '50 Images', size: '800 MB' },
      { id: 'i6', title: 'Memes', subtitle: 'Misc', icon: createIcon(ImageIcon), metadata: '1204 Images', size: '450 MB' },
    ]
  },
  Misc: {
    recent: [
      { id: 'misc1', title: 'Downloads', subtitle: 'Unsorted', icon: createIcon(Archive), metadata: '452 Files', size: '12.4 GB' },
      { id: 'misc2', title: 'Documents', subtitle: 'PDFs & Docs', icon: createIcon(Folder), metadata: '128 Files', size: '850 MB' },
      { id: 'misc3', title: 'Old Backups', subtitle: 'Archives', icon: createIcon(Archive), metadata: '3 Files', size: '45 GB' },
    ],
    all: [
      { id: 'misc4', title: 'Fonts', subtitle: 'Typography', icon: createIcon(Folder), metadata: '340 Files', size: '250 MB' },
      { id: 'misc5', title: 'Temp', subtitle: 'Cache', icon: createIcon(Folder), metadata: '8904 Files', size: '2.1 GB' },
    ]
  }
};
