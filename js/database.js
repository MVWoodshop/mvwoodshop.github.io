// Initialize Firebase
var config = {
    apiKey: "AIzaSyDDhI6BXvTYlXAx54d8XJ6AlnUDPREuvRI",
    authDomain: "woodshop-ea8e5.firebaseapp.com",
    databaseURL: "https://woodshop-ea8e5.firebaseio.com",
    storageBucket: "woodshop-ea8e5.appspot.com",
}; 
firebase.initializeApp(config);
var database = firebase.database();
var storage = firebase.storage();
var imglink = "";
var inner = "";

var link = "https://3.bp.blogspot.com/--CbNHF6p9ZQ/T1QNvLMkCXI/AAAAAAAABok/9zgT1MWgMuY/s1600/tvlinks.jpg";

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    document.getElementById("uploading").style.visibility = 'visible';

    var file = evt.target.files[0];
    addFile(file);

    database.ref('/index/').once('value').then(function(snapshot) {
        var index = snapshot.val() + 1;
        var data = {};
        data[index] = link;
        var metadata = {
            'contentType': file.type
        };
        var storageRef = storage.ref();
        storageRef.child('images/' + index + '.jpg').put(getFile(), metadata).then(function(snapshot) {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            var url = snapshot.metadata.downloadURLs[0];
            console.log('File available at', url);
            var string = '<div class="col s6 m4"><div class="card hoverable"><div class="card-image"><img src="' + url + '" class="responsive-img" /></div></div></div>';
            addToGallery(string);
            document.getElementById("uploading").style.visibility = 'hidden';
        }).catch(function(error) {
            console.error('Upload failed:', error);
            document.getElementById("uploading").style.visibility = 'hidden';
        });
        database.ref('index/').set(index);
    });

}

function populateGallery() {
    document.getElementById('loading').style.display = 'inherit';
    document.getElementById('load-btn').style.display = 'none';
    database.ref('/index/').once('value').then(function(snapshot) {
        var index = snapshot.val();
        var storageRef = storage.ref();

        recursive(index, index, 6, storageRef);
    });
}

function recursive(i, index, total, storageRef) {
    if(i > index - total && i > 0) {
        storageRef.child('images/' + i + '.jpg').getDownloadURL().then(function(url) {
            console.log(url);
            var string = '<div class="col s6 m4"><div class="card hoverable"><div class="card-image"><img src="' + url + '" class="responsive-img" /></div></div></div>';
            addToGallery(string);
            recursive(i - 1, index, total, storageRef);
        }).catch(function(error) {
            recursive(i - 1, index, total + 1, storageRef);
        });
    } else {
        document.getElementById('loading').style.display = 'none';
    }
    if(i > 0 && i == index - total + 1) {
        console.log("hello");
        document.getElementById('load-btn').style.display = 'block';
    }
}

function addFile(file) {
    imglink = file;
}

function getFile(file) {
    return imglink;
}

function addToGallery(string) {
    document.getElementById('display').innerHTML += string;
    inner += string;
}
