imagePinch
----------

Compress image by image size.

Demo URL: http://faceach.github.io/imagePinch/

Scenario
========
Before upload an image file, compress image will bring a speed experience.

```
    var imagePinch = new ImagePinch({
        file: file,
        toHeight: 400, // *px
        maxSize: 1024, // *kb
        success: function(file) {
            render(file, "imgpinched");
        }
    });
    imagePinch.pinch();
```