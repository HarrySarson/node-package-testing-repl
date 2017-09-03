
module.exports = (source, target) => {
  
  const rd = fs.createReadStream(source);
  const wr = fs.createWriteStream(target);
  
  rd.pipe(wr);

  return new Promise(function(resolve, reject) {
      wr.on("end", resolve);
      
      wr.on("error", reject);
      rd.on("error", reject);
  });  
}
