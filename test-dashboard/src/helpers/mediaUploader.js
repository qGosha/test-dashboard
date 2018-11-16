import {MediaUploader} from './corsUploader';


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
        this.settingState('error', message);
        this.settingState('uploadingInProcess', false)
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
      this.settingState('percentageComplete', percentageComplete)

    }.bind(this),

    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      console.log(this.videoId);
      allVideos.push(uploadResponse);
      this.settingState('allVideos', allVideos);
      this.settingState('title', '');
      this.settingState('description', '');
      this.settingState('tags', '');
      this.settingState('uploadingInProcess', false)
    }.bind(this)
  });
  this.uploadStartTime = Date.now();
  this.settingState('uploadingInProcess', true)
  uploader.upload();
};
