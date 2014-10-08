var transforms = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"];
var element = document.createElement("div").style;

var property = (function(){
    var index = transforms.length;
    while (index--) {
        if (transforms[index] in element) {
            return transforms[index];
        }
    }
    return false;
})();

module.exports = property;

module.exports.matrix3d = (function (){
   var el, has3d;

   if (!property){
      return false;
   }
   
   /* Create a new element */
   el = document.createElement('p');

   /* Apply a transform */
   el.style[property] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

   /* 
   Add it to the body to get the computed style (for Opera mostly).
   Since it's empty, it shouldn't interfere with layout in modern browsers. 
   */
   document.body.insertBefore(el, document.body.lastChild);
   
   /* Get the computed value */
   has3d = window.getComputedStyle(el).getPropertyValue(property);

   /* 
   If it's not undefined, tell us whether it is 'none'.
   Otherwise, return false.
   */
   if( has3d !== undefined ){
      return has3d !== 'none';
   } else {
      return false;
   }
})();