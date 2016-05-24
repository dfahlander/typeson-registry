module.exports = Array.from || function (iterator) {
   var res = [];
   for (var i=iterator.next(); !i.done; i = iterator.next()) {
      res.push(i.value);
   }
   return res;
}
