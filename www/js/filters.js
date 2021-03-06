angular.module('starter.filters', [])

.filter('rawHtml', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('parseDate', function() {
  return function(value) {
      return Date.parse(value);
  };
})

.filter('split', function() {
	return function(input, splitChar, splitIndex) {
	    // do some bounds checking here to ensure it has that index
	    return input.split(splitChar)[splitIndex];
	}});
