



			function init() {

				container = document.createElement( 'div' );
				document.getElementById('lyrics').appendChild( container );
				window.addEventListener( 'resize', onWindowResize, false );
				camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();

				var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite() ), blending: THREE.AdditiveBlending } );

				for ( var i = 0; i < 250; i++ ) {

					particle = new THREE.Particle( material );
					
					initParticle( particle, i * 50);

					scene.addObject( particle );
				}
				canvasCreated= true;
				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.sortElements = false;
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			}


			function generateSprite() {

				var canvas = document.createElement( 'canvas' );
				canvas.width = 50;
				canvas.height = 50;

				var context = canvas.getContext( '2d' );
				var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
				gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
				gradient.addColorStop( 0.2, 'rgba(255,51,51,1)' );
				gradient.addColorStop( 0.4, 'rgba(51,0,0,1)' );
				gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

				context.fillStyle = gradient;
				context.fillRect( 0, 0, canvas.width, canvas.height );

				return canvas;

			}

			function initParticle( particle, delay ) {
				
				var particle = this instanceof THREE.Particle ? this : particle;
				var delay = delay !== undefined ? delay : 0;
				
				
				particle.position.x = 0;
				particle.position.y = 0;
				particle.position.z = 0;
				particle.scale.x = particle.scale.y = Math.random() * 3 + 1;

				new TWEEN.Tween( particle )
					.delay( delay )
					.to( {}, 10000 )
					.onComplete( initParticle )
					.start();

				new TWEEN.Tween( particle.position )
					.delay( delay )
					.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
					.start();

				new TWEEN.Tween( particle.scale )
					.delay( delay )
					.to( { x: 0, y: 0 }, 10000 )
					.start();

			}

			//

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
			

			}

			function render() {

				TWEEN.update();
				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				renderer.render( scene, camera );

			}
				function onWindowResize( event ) {

	var width = window.innerWidth, height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';

}