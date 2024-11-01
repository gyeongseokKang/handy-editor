export const getAudio = (id) => {
  //   // Fisher-Yates Shuffle을 통해 배열을 섞기
  //   const shuffled = sample.slice(); // 원본 배열을 수정하지 않기 위해 복사
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //   }

  //   // 섞인 배열에서 필요한 개수만큼 가져오기
  //   return shuffled.slice(0, sampleCount);
  return sample[id];
};

export const getSample = (sampleCount) => {
  //   // Fisher-Yates Shuffle을 통해 배열을 섞기
  const shuffled = sample.slice(); // 원본 배열을 수정하지 않기 위해 복사
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // 섞인 배열에서 필요한 개수만큼 가져오기
  return shuffled.slice(0, sampleCount);
};
export const sample = [
  {
    moods: "Epic,Sentimental",
    bpm: "102 BPM",
    artist: "Edward Karl Hanson",
    title: "Touched by the Light",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/epic/touched by the light - edward karl hanson_trim.wav",
  },
  {
    moods: "Dreamy,Relaxing",
    bpm: "",
    artist: "Silver Maple",
    title: "Av Jord, Till Jord",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dreamy/av jord, till jord - silver maple_trim.wav",
  },
  {
    moods: "Relaxing,Dreamy",
    bpm: "102 BPM",
    artist: "DEX 1200",
    title: "Atoms",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dreamy/atoms - dex 1200_trim.wav",
  },
  {
    moods: "Happy,Dreamy",
    bpm: "30 BPM",
    artist: "Drift Far Away",
    title: "Tranquility",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/hopeful/tranquility - drift far away_trim.wav",
  },
  {
    moods: "Happy",
    bpm: "",
    artist: "Johannes Bornlöf",
    title: "Frontiers",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/film/es_frontiers - johannes bornlof_trim.wav",
  },
  {
    moods: "Dark,Mysterious",
    bpm: "20 BPM",
    artist: "Flouw",
    title: "The Dark Ages",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dark/the dark ages - flouw_trim.wav",
  },
  {
    moods: "Happy,Dreamy",
    bpm: "80 BPM",
    artist: "Johannes Bornlöf",
    title: "Caterpillar",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/hopeful/caterpillar - johannes bornlof_trim.wav",
  },
  {
    moods: "Dark",
    bpm: "20 BPM",
    artist: "Christian Andersen",
    title: "Devil's Night",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dark/devil's night - christian andersen_trim.wav",
  },
  {
    moods: "Dark,Suspense",
    bpm: "20 BPM",
    artist: "Christian Andersen",
    title: "When Everyone Else Is Gone",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dark/when everyone else is gone - christian andersen_trim.wav",
  },
  {
    moods: "Fear,Dark",
    bpm: "20 BPM",
    artist: "Flouw",
    title: "A Far Cry",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/fear/a far cry - flouw_trim.wav",
  },
  {
    moods: "Epic,Happy",
    bpm: "63 BPM",
    artist: "Dream Cave",
    title: "The New World",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/adventure/es_the new world - dream cave_trim.wav",
  },
  {
    moods: "Suspense,Relaxing",
    bpm: "50 BPM",
    artist: "John Barzetti",
    title: "Osoreru",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/suspense/osoreru - john barzetti_trim.wav",
  },
  {
    moods: "Dreamy",
    bpm: "100 BPM",
    artist: "Jon Sumner",
    title: "Desert Winds",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/floating/desert winds - jon sumner_trim.wav",
  },
  {
    moods: "Dark,Dreamy",
    bpm: "20 BPM",
    artist: "Placidic",
    title: "Silent Caves",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dark/silent caves - placidic_trim.wav",
  },
  {
    moods: "Epic,Sentimental",
    bpm: "66 BPM",
    artist: "Experia",
    title: "Accepting Defeat",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/adventure/es_accepting defeat - experia_trim.wav",
  },
  {
    moods: "Sentimental,Dreamy",
    bpm: "85 BPM",
    artist: "Christoffer Moe Ditlevsen",
    title: "Lumina",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/floating/lumina - christoffer moe ditlevsen_trim.wav",
  },
  {
    moods: "Epic",
    bpm: "125 BPM",
    artist: "August Wilhelmsson",
    title: "Orchestral's Tune 05",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/adventure/es_orchestral's tune 05 - august wilhelmsson_trim.wav",
  },
  {
    moods: "Dark,Dreamy",
    bpm: "120 BPM",
    artist: "Guy Copeland",
    title: "Correlation Coefficient",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/dark/correlation coefficient - guy copeland_trim.wav",
  },
  {
    moods: "Sentimental,Dreamy",
    bpm: "100 BPM",
    artist: "August Wilhelmsson",
    title: "Thrilling India 2",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/film/es_thrilling india 2 - august wilhelmsson_trim.wav",
  },
  {
    moods: "Suspense,Nervous",
    bpm: "20 BPM",
    artist: "Prozody",
    title: "Distant Observer",
    duration: 62.2,
    url: "https://d2g83o743nm97d.cloudfront.net/music_replacement/music_data_v2/epidemic-sound/suspense/distant observer - prozody_trim.wav",
  },
];
