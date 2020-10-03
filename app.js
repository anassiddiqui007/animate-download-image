
var img, audio, canvas, ctx, x, dx,start;

function play(){
  //clear all timeouts when play button is clicked
  for(var i=0; i<100; i++){
    window.clearTimeout(i);
  };
  x=0;      //initializing starting position for image
  start = Date.now();   // initializing time
  audio.currentTime = 0; //resetting the audio file to start
  animate();  //Start animation
  audio.play(); //Start audio
  setTimeout(()=>audio.pause(), 5000);  //Stop audio after 5 seconds
  startRecording();  //Start Recording audio and canvas stream
}

function startRecording() {
  var frames = [];
  var canvasStream = canvas.captureStream();
  var audioStream = audio.captureStream();
  var audioTrack = audioStream.getAudioTracks()[0];
  canvasStream.addTrack(audioTrack);
  var rec = new MediaRecorder(canvasStream);
  rec.ondataavailable = e => frames.push(e.data); //Push to frames array while recording
  rec.onstop = e => exportVid(new Blob(frames, {type: 'video/mp4'}));
  rec.start();  //Start recording (lag possible according to machine)
  setTimeout(()=>rec.stop(), 5000);   //Stop recording after 5 sec
}

function exportVid(blob) {
  //Clear Download section to avoid multiple download buttons
  $('#download-video').html('');
  //Create Video Element
  var vid = $('<video />', {
    src : URL.createObjectURL(blob),
    controls : true
  });
  //Create Download Link and append to the page
  var a = $('<a></a>').attr("href",vid[0].src)
            .html("Download")
            .attr("download","myvid.mp4")
            .addClass('btn')
            .addClass('btn-primary');
  $('#download-video').append(a);
}

function animate(){
  x = (x - dx) % canvas.width;     //New x coordinate for image
  ctx.drawImage(img, x,0,img.width,canvas.height);
  if (Date.now()-start <= 5000){   //Animate for 5 sec
    requestAnimationFrame(animate);
  }
}

$(document).ready(function() {
  //Creating image element from Image file
  img = new Image();
  img.src = 'https://images.pexels.com/photos/2915997/pexels-photo-2915997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
  img.crossOrigin = 'anonymous';
  //Creating audio element from audio file
  audio = new Audio("https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3");
  audio.crossOrigin = 'anonymous';
  //Canvas
  canvas = $('#canvas')[0];
  ctx = canvas.getContext('2d');
  // img.height = canvas.height;
  //x movement parameters
  dx = 1;
});
