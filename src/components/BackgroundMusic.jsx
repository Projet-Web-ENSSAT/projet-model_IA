import { useEffect, useRef } from "react";

const BackgroundMusic = ({ fileName }) => {
  // On utilise useRef pour garder la même instance de l'audio
  const audioRef = useRef(null);

  useEffect(() => {
    // On charge le fichier depuis le dossier public
    audioRef.current = new Audio(`src/assets/audio/${fileName}`);
    const audio = audioRef.current;

    audio.loop = true;
    audio.volume = 0.3; // Volume assez bas pour l'ambiance (0.0 à 1.0)

    const playAudio = () => {
      audio.play().catch((err) => {
        console.log("En attente d'un clic pour lancer la musique...");
      });
      // On retire l'écouteur une fois que ça joue
      window.removeEventListener("click", playAudio);
    };

    // Le navigateur oblige une interaction utilisateur pour lancer le son
    window.addEventListener("click", playAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", playAudio);
    };
  }, [fileName]);

  return null;
};

export default BackgroundMusic;
