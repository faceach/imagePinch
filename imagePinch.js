(function(WIN) {
    'use strict';

    var CONTENT_TYPE = "image/jpeg";

    function blobToFile(theBlob, fileName) {
        // A Blob() is almost a File()
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
        var dataURL = canvas.toDataURL(img.type || "image/jpeg");

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

    var ImagePinch = function(opts) {

        // default options
        this.options = {
            file: null,
            toWidth: null,
            toHeight: null,
            maxSize: null,
            success: null
        }

        // extend options
        if (Object.prototype.toString.call(opts) === '[object Object]') {
            for (var opt in opts) {
                this.options[opt] = opts[opt];
            }
        }

    };

    ImagePinch.prototype.pinch = function() {
        WIN.URL = WIN.URL || WIN.webkitURL;
        if (typeof WIN.URL === "undefined") {
            throw "imagePinch require Web Service \"FileReader\" and \"URL\".";
            return;
        }

        if (!this.options.file) {
            throw "file is required.";
            return;
        }

        var img = new Image();
        img.src = WIN.URL.createObjectURL(this.options.file);
        img.onload = (function(me) {
            return function(e) {
                var imgDataURL = resizeImg(img, me.options.toWidth, me.options.toHeight);
                var blob = base64ToBlob(getImgDataFromDataURL(imgDataURL), me.options.file.type);
                var file = blobToFile(blob, me.options.file.name);
                me.options.success.call(me, file);
            };
        })(this);
    };

    WIN.ImagePinch = ImagePinch;

})(window);
