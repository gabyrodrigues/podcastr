import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './styles.module.scss';

export default function Player () {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasPrevious,
    hasNext
  } = usePlayer();

  useEffect(() =>{
    if(!audioRef.current) { //se não tiver nada tocando não retorna nada
      return;
    }

    if(isPlaying) { //se tiver valor ele toca senão ele pausa o audio
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener () { //observar o progresso do player
    audioRef.current.currentTime = 0; //sempre que for trocando de episodio ele volta pra 0

    audioRef.current.addEventListener('timeupdate', () => { //atualiza sempre conforme o audio for tocando
      setProgress(Math.floor(audioRef.current.currentTime)); //retorna o tempo atual do player
    });
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {
        episode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {
              episode ? (
                <Slider
                  max={episode.duration}
                  value={progress} //mostra o progresso do audio no slider
                  trackStyle={{backgroundColor: '#04d361'}}
                  railStyle={{backgroundColor: '#9f75ff'}}
                  handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                />
              ) : (
                <div className={styles.emptySlider}></div>
              )
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {
          episode && (
            <audio
              src={episode.url}
              ref={audioRef}
              autoPlay
              loop={isLooping}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener} //assim que ele conseguiu carregar os dados do episodio
            />
          )
        }

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {
              isPlaying ? (
                <img src="/pause.svg" alt="Pausar" />
              ) : (
                <img src="/play.svg" alt="Tocar" />
              )
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
