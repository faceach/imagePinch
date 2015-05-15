imagePinch
========

Compress image by image dimension(use canvas).

image -> canvas -> data-URL -> Blob -> File -> image

Demo URL: http://faceach.github.io/imagePinch/

Scenario
--------
Before upload an image file, compress image will bring a good speed experience.

Code example
------------
```
    var imagePinch = new ImagePinch({
        file: file,
        toHeight: 400, // *px
        maxSize: 1024, // *kb
        success: function(file) {
            // Post in "Content-Type:application/octet-stream"
            // Or
            // Append to document as an Image
            var img = new Image();
            img.src = window.URL.createObjectURL(file);
        }
    });
    imagePinch.pinch();
```