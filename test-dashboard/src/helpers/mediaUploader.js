import {MediaUploader} from './corsUploader';

var STATUS_POLLING_INTERVAL_MILLIS = 15 * 1000;

export var UploadVideo = function() {
  this.tags = ['youtube-cors-upload'];

  this.categoryId = 22;

  this.videoId = '';

  this.uploadStartTime = 0;
};


UploadVideo.prototype.uploadFile = function(file, description, title, tags, allVideos) {
  var metadata = {
    contentDetails: true,
    id: true,
    snippet: {
      title: title,
      description: description,
      tags: tags,
      categoryId: 22
    },
    status: {
      privacyStatus: 'unlisted'
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
        this.settingState({
          'error': message,
          'uploadingInProcess': false
        });
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
      this.settingState({'percentageComplete': percentageComplete})
    }.bind(this),

    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      console.log(this.videoId);
      allVideos.push(uploadResponse);
      this.settingState({
        'allVideos': allVideos,
        'title': '',
        'description': '',
        'tags': '',
        'uploadingInProcess': false,
        'processingInProcess': true,
        'currentlyProcessing': this.videoId,
        'percentageComplete': 0
    });
    this.pollForVideoStatus();

    }.bind(this)
  });
  this.uploadStartTime = Date.now();
  this.settingState({'uploadingInProcess': true})
  uploader.upload();
};


UploadVideo.prototype.pollForVideoStatus = function() {
  window.gapi.client.request({
    path: '/youtube/v3/videos',
    params: {
      part: 'status,player',
      id: this.videoId
    },
    callback: function(response) {
      if (response.error) {
        // The status polling failed.
        console.log(response.error.message);
        setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
      } else {
        var uploadStatus = response.items[0].status.uploadStatus;
        switch (uploadStatus) {
          // This is a non-final status, so we need to poll again.
          case 'uploaded':
            setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
            break;
          // The video was successfully transcoded and is available.
          case 'processed':
          this.settingState({
            'processingInProcess': false,
            'processingComplete': response.items[0].player.embedHtml,
            'currentlyProcessing': null
          })
            break;
          // All other statuses indicate a permanent transcoding failure.
          default:
            this.settingState({'error' : 'Transcoding failed'})
            break;
        }
      }
    }.bind(this)
  });
};
