(function(WIN) {
    'use strict';

    function blobToFile(blob, fileName) {
        // A Blob() is almost a File()
        // Add some File() required properties
        var d = new Date();
        blob.lastModified = d.getTime();
        blob.lastModifiedDate = d;
        blob.name = fileName || "pinch";
        return blob;
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
        /*
        // maxSize == null && with (toWidth or toHeight) --> force to resize
        */

        // default options
        this.options = {
            file: null, //File()
            toWidth: null, // *px
            toHeight: null, // *px
            maxSize: null, // *kb
            success: null // function(file){}
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

        // Return while without action options
        if (!this.options.maxSize && !this.options.toWidth && !this.options.toHeight) {
            this.options.success.call(this, this.options.file);
            return;
        }
        // Return while size is in control
        if (this.options.maxSize && this.options.file.size <= this.options.maxSize * 1024) {
            this.options.success.call(this, this.options.file);
            return;
        }

        // Compress Image
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
