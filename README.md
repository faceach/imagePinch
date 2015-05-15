# imagePinch

Compress image(size) by Canvas before upload, get a low quality image.

  // file, toWidth, toHeight
        var pinchedImage = imagePinch(file, null, 400);
        pinchedImage.getFile(function(file) {
            console.log("Pinched file size: " + (file.size / 1024).toFixed(2) + "kb");
            console.dir(file)
        });
        pinchedImage.getBlob(function(blob) {
            var imagePinched = new Image();
            imagePinched.src = window.URL.createObjectURL(blob);;
            var elImgPinched = document.getElementById("imgpinched");
            while (elImgPinched.hasChildNodes()) {
                elImgPinched.removeChild(elImgPinched.lastChild);
            }
            elImgPinched.appendChild(imagePinched);
        });
