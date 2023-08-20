// Import TensorFlow.js dependencies
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';

// Import pose-detection related dependencies
import * as poseDetection from '@tensorflow-models/pose-detection';

// Import Three.js
import * as THREE from 'three';

// Import scatter-gl
import ScatterGL from 'scatter-gl';


const app = {
    debug: false, 
    init: function() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('model')) {
            model = params.get('model');
        }

        if (params.has('source')) {
            source = params.get('source');
        }

        if (params.has('url')) {
            sourceVideo = params.get('url');
        }

        document.getElementById('model_select').value = model;
        document.getElementById('source-' + source).classList.add('active');

        const sources = document.querySelectorAll('.source-select');
        sources.forEach(el => {
            el.addEventListener('click', function(e) {
                let href = '?model=' + model + '&source=' + this.getAttribute('data-source');
                if (source == this.getAttribute('data-source')) {
                    href = href + '&url=' + sourceVideo;
                }
                window.location.href = href;
            });
        });

        document.getElementById('model_select').addEventListener('change', function(e) {
            const href = '?model=' + this.value + '&source=' + source + '&url=' + sourceVideo;
            window.location.href = href;
        });

        document.getElementById('btn_load_src').addEventListener('change', function(e) {
            sourceVideo = document.getElementById('video_src').value;
        });

        switch (source) {
            case 'camera':
                document.getElementById('video_src_area').style.display = "none";
                document.getElementById('canvas').classList.add('camera');
                break;

            case 'video':
                document.getElementById('video_src_area').style.display = "block";
                if (sourceVideo.trim() == '') {
                    sourceVideo = defaultVideo;
                }
                document.getElementById('video').src = sourceVideo;
                document.querySelector('#video source').src = sourceVideo;
                document.getElementById('video_src').value = sourceVideo;
                document.getElementById('video_src_prefix').innerHTML = 'MP4,AVI,MKV,WEBM';
                document.getElementById('canvas').classList.add('clickable');

                document.getElementById('btn_load_src').addEventListener('click', function() {
                    const src = document.getElementById('video_src').value;
                    tracker.loadVideo(src);
                });
                break;

            case 'stream':
                document.getElementById('video_src_area').style.display = "block";
                if (sourceVideo.trim() == '') {
                    sourceVideo = defaultStream;
                }
                document.querySelector('#video source').src = sourceVideo;
                document.getElementById('video_src').value = sourceVideo;
                document.getElementById('video_src_prefix').innerHTML = 'IPTV STREAM,m3u8';
                document.getElementById('canvas').classList.add('clickable');

                document.getElementById('btn_load_src').addEventListener('click', function() {
                    const src = document.getElementById('video_src').value;
                    tracker.loadStream(src);
                });
                break;
        };

        document.getElementById('btn_toggle_ai').addEventListener('click', function() {
            app.toggleAI();
        });

        document.getElementById('btn_toggle_debug').addEventListener('click', function() {
            app.toggleDebug();
        });

        document.getElementById('btn_toggle_3d').addEventListener('click', function() {
            app.toggle3D();
        });

        document.getElementById('btn_toggle_video').addEventListener('click', function() {
            app.toggleVideo();
        });

        document.getElementById('btn_toggle_controls').addEventListener('click', function() {
            app.toggleControls();
        });
    },

    toggleAI: function() {
        if (tracker.enableAI) {
            tracker.enableAI = false;
            console.log('AI ON');
        } else {
            tracker.enableAI = true;
            console.log('AI OFF');
        }
    },

    toggleVideo: function() {
        if (tracker.enableVideo) {
            tracker.enableVideo = false;
            console.log('Video OFF');
        } else {
            console.log('Video ON');
            tracker.enableVideo = true;
        }
    },
    toggle3D: function() {
        if (tracker.detectorModel != poseDetection.SupportedModels.BlazePose) {
            alert('3D is available for BlazePose model only!');
            return;
        }

        if (tracker.scatterGL == null) {
            console.error('ScatterGL is not initialized');
            return;
        }

        if (tracker.enable3D) {
            tracker.enable3D = false;
            tracker.scatterGLEl.style.display = "none";
            console.log('3D OFF');
        } else {
            console.log('3D ON');
            tracker.enable3D = true;
            tracker.scatterGLEl.style.display = "block";
            tracker.scatterGL.resize();
        }
    },

    toggleDebug: function() {
        if (app.debug) {
            app.debug = false;
            document.getElementById('info_debug').innerHTML = '';
            console.log('Debug OFF');
        } else {
            app.debug = true;
            console.log('Debug ON');
        }
    },

    toggleControls: function() {
        const controls = document.getElementById('controls');
        if (controls.style.display == 'none') {
            controls.style.display = 'block';
        } else {
            controls.style.display = 'none';
        }
    },

    updateStatus: function(msg) {
        document.getElementById('status').innerHTML = msg;
    },

    updateCounter: function(poses) {
        let i = 0;
        if (poses) {
            i = poses.length;
        }
        document.getElementById('info_counter').innerHTML = i;
    },

    updateDebug: function(poses) {
        if (!app.debug) {
            return;
        }
        let str = '',
            n = 0,
            i = 0;
        for (let pose of poses) {
            str = str + '[ pose ' + i + ' ]<br>';
            for (let kp of pose.keypoints) {
                str = str + i + ': ' + kp.name;
                str = str + ', ';
                str = str + 'x:' + kp.x;
                str = str + ', ';
                str = str + 'y:' + kp.y;
                if (typeof kp.z !== 'undefined') {
                    str = str + ', ';
                    str = str + 'z:' + kp.z;
                }
                str = str + ', ';
                str = str + 's:' + kp.score;
                str = str + '<br>';
                i++;
            }
            n++;
        }
        document.getElementById('info_debug').innerHTML = str;
    },
}
