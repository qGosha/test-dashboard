import {MediaUploader} from './corsUploader';


export var UploadVideo = function() {
  this.tags = ['youtube-cors-upload'];

  this.categoryId = 22;

  this.videoId = '';

  this.uploadStartTime = 0;
};


UploadVideo.prototype.uploadFile = function(file) {
  var metadata = {
    snippet: {
      title: 'Teeest',
      description: 'New video',
      tags: this.tags,
      categoryId: 22
    },
    status: {
      privacyStatus: 'private'
    }
  };
  var uploader = new MediaUploader({
    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: window.gapi.client.getToken().access_token,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
      } finally {
        alert(message);
      }
    }.bind(this),
    onProgress: function(data) {
      var currentTime = Date.now();
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
      var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
      var percentageComplete = (bytesUploaded * 100) / totalBytes;
      console.log(percentageComplete, estimatedSecondsRemaining, bytesPerSecond);
      this.settingState('dermao', false)

    }.bind(this),

    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      console.log(this.videoId);
    }.bind(this)
  });
  this.uploadStartTime = Date.now();
  uploader.upload();
};
