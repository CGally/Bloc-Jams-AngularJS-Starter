(function() {
    function seekBar($document) {

        /**
        * @function calculatePercent
        * @desc Calculates the horizontal percent along the seek bar where the event occurred.
        * @param {Object} Event
        */
        var calculatePercent = function(seekBar, event) {
            /**
            * @desc Calculates the horizontal location of the event on the page relative to the seekbar
            * @type {Object}
            */
            var offsetX = event.pageX - seekBar.offset().left;

            /**
            * @desc Calculated the seekbar width
            * @type {Object}
            */
            var seekBarWidth = seekBar.width();

            /**
            * @desc Calculates the percent of where the event occured on the seekbar between 0%-100%
            * @type {Object}
            */
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attributes) {

                /**
                * @desc Holds the value of the seek bar
                * @type {Object}
                */
                scope.value = 0;

                /**
                * @desc Holds the maximum value of the seek bars. Default 100
                * @type {Object}
                */
                scope.max = 100;

                /**
                * @desc Holds the element <seek-bar> as a jQuery object so we can call jQuery methods on it.
                * @type {object}
                */
                var seekBar = $(element)

                /**
                * @function percentString
                * @desc Calculates percent based on the value and maximum value of the seek bar
                * @param {Object}
                */
                var percentString = function() {
                    /**
                    * @desc Sets a new variable equal to the value of the seek bar
                    * @type {Object}
                    */
                    var value = scope.value;

                    /**
                    * @desc Sets a new variable equal to the maximum value of the seek bar
                    * @type {Object}
                    */
                    var max = scope.max;

                    /**
                    * @desc Sets a new variable that calculates percent
                    * @type {Object}
                    */
                    var percent = value / max * 100;
                    return percent + '%';
                };

                /**
                * @function fillStyle
                * @desc Returns the width of the seek bar fill element based on the calculated percent.
                * @param {Object}
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                * @function onClickSeekBar
                * @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
                * @param {Object}
                */
                scope.onClickSeekBar = function(event) {

                    /**
                    * @desc Calls the calculatePercent function and stores the information in the percent variable
                    * @type {Object}
                    */
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };

                /**
                * @function trackThumb
                * @desc Uses $apply to constantly apply the change in value of scope.value as the user drags the seek bar thumb.
                * @param {Object}
                */
                scope.trackThumb = function() {

                   /**
                   * @function anonymous
                   * @desc Calculates the percent on the seekbar of where the mouse moves
                   * @param {Object}
                   */
                    $document.bind('mousemove.thumb', function(event) {

                       /**
                       * @desc Calls the calculatePercent function and stores the information in the percent variable
                       * @type {Object}
                       */
                        var percent = calculatePercent(seekBar, event);

                        /**
                        * @function anonymous
                        * @desc Applies the percent to the scope
                        * @param {Object}
                        */
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

        }
    };
}

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
