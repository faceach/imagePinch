imagePinch
----------

Compress image(size) by Canvas before upload, get a low quality image.

Demo URL: http://faceach.github.io/imagePinch/

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