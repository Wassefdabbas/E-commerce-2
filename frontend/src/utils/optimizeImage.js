const optimizeImage = (url, width = 400) => {
    if (!url) return url;
    // f_auto → automatic format, q_auto → automatic quality, w → width
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  };

  export default optimizeImage;