// Variable globale pour le player YouTube
let youtubePlayer;
let playerReady = false;

// ID de la vidéo YouTube que vous souhaitez utiliser
const youtubeVideoId = 'KG6ft_YDp5k';

// Point de départ en secondes
const startTimeSeconds = 13;

// Fonction appelée automatiquement par l'API YouTube lorsqu'elle est prête
function onYouTubeIframeAPIReady() {
  console.log('YouTube API Ready');
  youtubePlayer = new YT.Player('youtube-player-container', {
    height: '1',
    width: '1',
    videoId: youtubeVideoId,
    playerVars: {
      'autoplay': 0, // On désactive l'autoplay initial
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'modestbranding': 1,
      'iv_load_policy': 3,
      'rel': 0,
      'showinfo': 0,
      'start': startTimeSeconds
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

// Fonction appelée lorsque le lecteur est prêt
function onPlayerReady(event) {
  console.log('Player ready');
  playerReady = true;
  
  // Définir le volume à 50%
  event.target.setVolume(50);
  
  // Afficher la notification pour informer l'utilisateur
  showMusicNotification();
}

// Fonction pour afficher la notification de musique
function showMusicNotification() {
  const notification = document.getElementById('music-notification');
  if (notification) {
    notification.classList.add('show');
    
    // Auto-fermeture après 8 secondes
    setTimeout(() => {
      notification.classList.remove('show');
    }, 8000);
  }
}

// Fonction appelée lorsque l'état du lecteur change
function onPlayerStateChange(event) {
  // Si la vidéo est terminée, la redémarrer (boucle)
  if (event.data === YT.PlayerState.ENDED) {
    console.log('Video ended, restarting');
    youtubePlayer.seekTo(startTimeSeconds, true);
    youtubePlayer.playVideo();
  }
}

// Fonction en cas d'erreur du lecteur
function onPlayerError(event) {
  console.error('YouTube Player Error:', event.data);
}

// Fonction pour démarrer la musique
function playMusic() {
  if (youtubePlayer && youtubePlayer.playVideo && playerReady) {
    console.log('Playing music');
    youtubePlayer.unMute();
    youtubePlayer.seekTo(startTimeSeconds, true);
    youtubePlayer.playVideo();
    
    // Mettre à jour le bouton de contrôle
    updateMusicControlButton(true);
  }
}

// Fonction pour mettre en pause la musique
function pauseMusic() {
  if (youtubePlayer && youtubePlayer.pauseVideo && playerReady) {
    console.log('Pausing music');
    youtubePlayer.pauseVideo();
    
    // Mettre à jour le bouton de contrôle
    updateMusicControlButton(false);
  }
}

// Fonction pour mettre à jour le bouton de contrôle de musique
function updateMusicControlButton(isPlaying) {
  const musicControl = document.getElementById('music-control');
  if (musicControl) {
    if (isPlaying) {
      musicControl.innerHTML = '⏸️';
      musicControl.title = 'Mettre en pause';
    } else {
      musicControl.innerHTML = '▶️';
      musicControl.title = 'Reprendre la lecture';
    }
  }
}

// Fonction exécutée quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Récupération des éléments DOM
  const notification = document.getElementById('music-notification');
  const closeBtn = document.getElementById('close-notification');
  const musicControl = document.getElementById('music-control');
  
  // Gestion du clic sur la page pour démarrer la musique
  document.body.addEventListener('click', function() {
    if (playerReady) {
      console.log('Body clicked, playing music');
      playMusic();
    }
  });

  // Contrôle de la musique (pause/lecture)
  if (musicControl) {
    musicControl.addEventListener('click', function(e) {
      e.stopPropagation(); // Empêcher la propagation pour éviter le déclenchement du clic sur le body
      
      if (youtubePlayer && playerReady) {
        const state = youtubePlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
          pauseMusic();
        } else {
          playMusic();
        }
      } else if (playerReady) {
        // Si le player n'est pas encore initialisé mais est prêt
        playMusic();
      }
    });
  }
  
  // Fermeture de la notification
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Empêcher la propagation
      notification.classList.remove('show');
    });
  }
});