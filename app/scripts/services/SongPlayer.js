(function() {
  function SongPlayer($rootScope,Fixtures) {
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
        stopSong(SongPlayer.currentSong);
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      if(SongPlayer.currentTime === currentBuzzObject.getDuration()) {
        SongPlayer.next();
      }
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
    * @function stopSong
    * @desc Stops the audio file in the currentBuzzObject and changes song status to playing
    * @param {Oblect} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    };

    /**
    * @desc The currently selected/playing song
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc Current volume.
    * @type {Number}
    */
    SongPlayer.volume = 50;

    /**
    * @function setVolume
    * @desc Sets the volume to allow the volume to change
    * @param {Object} number
    */
    SongPlayer.setVolume = function(nVolume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(nVolume);
        SongPlayer.volume = nVolume;
      }
    };

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
         stopSong(SongPlayer.currentSong);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function next
    * @desc Goes to next song or stops playing if currentSong is the last song
    * @param {Oblect} song
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      if (currentSongIndex > currentAlbum.songs.length - 1) {
        stopSong(SongPlayer.currentSong);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    /**
    * @function muteUnMute
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.muteUnMute = function() {
      var v = SongPlayer.volume;
      if(currentBuzzObject.volume !== 0) {
        currentBuzzObject.setVolume(0);
        SongPlayer.muted = true;
      } else {
        currentBuzzObject.setVolume(v);
        SongPlayer.muted = false;
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer',['$rootScope', 'Fixtures', SongPlayer]);
})();
