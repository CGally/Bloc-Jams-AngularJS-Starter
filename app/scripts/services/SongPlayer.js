(function() {
  function SongPlayer(Fixtures) {
    /**
    * @desc When returned this makes the properties and methods public
    * @type {Object}
    */
    var SongPlayer = {};

    /**
    * @desc Uses the album method from the Fixtures service to store the album data in currentAlbum
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
     * @function setSong
     * @desc Stops currently playing song and loads new audio file as currentBuzzObject
     * @param {Object} song
     */
    var setSong = function(song) {
      if(currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays the audio file in the currentBuzzObject and changes song status to playing
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
    * @function getSongIndex
    * @desc Returns the index of the song in the current album
    * @param {Oblect} song
    */
    var getSongIndex = function(song){
      return currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc The currently selected/playing song
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @function play
    * @desc Checks if the current song equals the selected song. Resumes Playing if it does. Plays selected song if it doesnt.
    * @param {Oblect} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if(SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if(SongPlayer.currentSong === song) {
        if(currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    * @function SongPlayer.pause
    * @desc Pauses the currently playing song and changed the song status to not playing/paused
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function previous
    * @desc Goes to previous song or stops playing if currentSong is the first song
    * @param {Oblect} song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      if (currentSongIndex < 0) {
         currentBuzzObject.stop();
         SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer',['Fixtures', SongPlayer]);
})();
