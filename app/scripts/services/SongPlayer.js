(function() {
  function SongPlayer() {
    /**
    * @desc When returned this makes the properties and methods public
    * @type {Object}
    */
    var SongPlayer = {};

    /**
    * @desc The currently selected/playing song
    * @type {Object}
    */
    var currentSong = null;

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
        currentSong.playing = null;
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
      currentSong = song;
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
    * @function play
    * @desc Checks if the current song equals the selected song. Resumes Playing if it does. Plays selected song if it doesnt.
    * @param {Oblect} song
    */
    SongPlayer.play = function(song) {
      if(currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if(currentSong === song) {
        if(currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    /**
    * @function SongPlayer.pause
    * @desc Pauses the currently playing song and changed the song status to not playing/paused
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    };
    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
