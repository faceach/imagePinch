(function(WIN) {
    'use strict';

    var CONTENT_TYPE = "image/jpeg";

    function blobToFile(theBlob, fileName) {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        var d = new Date();
        theBlob.lastModified = d.getTime();
        theBlob.lastModifiedDate = d;
        theBlob.name = fileName || "pinch";
        return theBlob;
    }

    function base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }

    function getImgDataURL(img, width, height) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to guess the
        // original format, but be aware the using "image/jpg" will re-encode the image.
        var dataURL = canvas.toDataURL(CONTENT_TYPE);

        return dataURL;
    }

    function getImgDataFromDataURL(imgDataURL) {
        // Data URLs use the following syntax:
        // data:[mimetype][;base64],[data]
        return imgDataURL.split(",")[1];
    }

    function resizeImg(img, toWidth, toHeight) {

        var width = img.width;
        var height = img.height;

        if (toWidth && !toHeight && width > toWidth) {
            toHeight = height * (toWidth / width);
        } else if (!toWidth && toHeight && height > toHeight) {
            toWidth = width * (toHeight / height);
        } else {
            toWidth = width;
            toHeight = height;
        }

        return getImgDataURL(img, toWidth, toHeight);
    }

    WIN.imagePinch = function(file, toWidth, toHeight) {
        if (typeof file === "undefined" || typeof FileReader === "undefined" || typeof URL === "undefined") {
            return;
        }

        var fileName = file.name;
        CONTENT_TYPE = file.type;
        return {
            "getBlob": function(callback) {
                var img = new Image();
                img.src = WIN.URL.createObjectURL(file);
                img.onload = function() {
                    var imgDataURL = resizeImg(img, toWidth, toHeight);
                    var blob = base64ToBlob(getImgDataFromDataURL(imgDataURL), CONTENT_TYPE);
                    callback(blob);
                };
            },
            "getFile": function(callback) {
                var img = new Image();
                img.src = WIN.URL.createObjectURL(file);
                img.onload = function() {
                    var imgDataURL = resizeImg(img, toWidth, toHeight);
                    var blob = base64ToBlob(getImgDataFromDataURL(imgDataURL), CONTENT_TYPE);
                    var file = blobToFile(blob, fileName);
                    callback(file);
                };
            }
        }
    };

})(window);
