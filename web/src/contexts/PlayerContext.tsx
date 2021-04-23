import { createContext, useState, ReactNode } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;

};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode; //quando o tipo pode ser qualquer coisa (div, string, number) por padrão é usado o tipo ReactNode
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play (episode: Episode) {
    setEpisodeList([episode]); //uma array com um unico episodio
    setCurrentEpisodeIndex(0); //força pra 0 de novo, pois como só tem um unico episodio, então esse index/episodio é o que precisa estar tocando
    setIsPlaying(true);
  }

  function togglePlay () {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState
      }}>
      {children}
    </PlayerContext.Provider>
  );
}
