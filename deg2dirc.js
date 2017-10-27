module.exports = function(d) {
    if (typeof d !== 'number' || isNaN(d)) {
      return -1;
    }
  
    // keep within the range: 0 <= d < 360
    d = d % 360;
  
    if (11.25 <= d && d < 33.75) {
      return "North north east (NNE)";
    } else if (33.75 <= d && d < 56.25) {
      return "North east (NE)";
    } else if (56.25 <= d && d < 78.75) {
      return "East north east (ENE)";
    } else if (78.75 <= d && d < 101.25) {
      return "East(E)";
    } else if (101.25 <= d && d < 123.75) {
      return "East south east (ESE)";
    } else if (123.75 <= d && d < 146.25) {
      return "South east (SE)";
    } else if (146.25 <= d && d < 168.75) {
      return " South south east (SSE)";
    } else if (168.75 <= d && d < 191.25) {
      return "South(S)";
    } else if (191.25 <= d && d < 213.75) {
      return " South south west (SSW)";
    } else if (213.75 <= d && d < 236.25) {
      return " South west (SW)";
    } else if (236.25 <= d && d < 258.75) {
      return " West south west (WSW)";
    } else if (258.75 <= d && d < 281.25) {
      return "West (W)";
    } else if (281.25 <= d && d < 303.75) {
      return "West north west (WNW)";
    } else if (303.75 <= d && d < 326.25) {
      return " North west (NW)";
    } else if (326.25 <= d && d < 348.75) {
      return "North north west (NNW)";
    } else {
      return "North(N)";
    }
  };