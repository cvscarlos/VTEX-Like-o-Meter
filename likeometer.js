(function($){


	$.fn.likeometer=function(opts)
	{
		var $this,log,extTitle,fn,options,_default,run,elem,renderFb,fbScriptLoaded,loadingScript=false,showNext,items=[],i=0;

		$this=$(this);
		extTitle="Like o meter";
		log=function(msg,type){
			if(typeof console=="object")
				console.log("["+extTitle+" - "+(type||"Erro")+"] "+msg);
		};
		
		_default=
		{
			// Tag HTML do like button
			likeTag:'<fb:like href="#url" send="false" width="#width" show_faces="false" colorscheme="#theme"></fb:like>',
			// Pausa inicial antes de começar a notificar o usuário. Em milesegundos
			delay:2000,
			// Tamanho da baixa do botão curtir
			likeWidth:"auto",
			// Tamanho do botão (em pixels) "curtir" esse valor será utilizado para esconder o botão
			likeBtWidth:60,
			// Tema do botão like: "light" ou "dark"
			colorTheme:"light",
			// Tempo em que o balão permanecerá exposto na tela
			displayTime:20000
		};
		options=$.extend({},_default,opts);
		
		// Renderizar controle do Facebook
		renderFb=function(callback)
		{
			var elem,fn;
			
			callback=callback||function(){};
			
			if(!$("#fb-root").length)
				$("body").prepend('<div id="fb-root"></div>');

			fn=function(d,s,id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/pt_BR/all.js#xfbml=1&appId=";
				fjs.parentNode.insertBefore(js,fjs);
				
				loadingScript=true;
				$(js).load(function(){
					fbScriptLoaded();
					loadingScript=false;
				});
			};

			if(!$("[src*='connect.facebook.net/pt_BR']").length)
				fn(document,'script','facebook-jssdk');
			else if(typeof(FB) !== "undefined")
				FB.XFBML.parse(document.getElementById('#fb-root'),callback);
			else if(!loadingScript)
				log("Não foi possível renderizar os controles do Facebook");
		};
		
		// Após carregar script do Facebook
		fbScriptLoaded=function(){};
		
		run=function($this)
		{
			e=
			{
				wrap:$('<div class="vtexlm-likeWrap"><span class="vtexlm-arrow"></span></div>'),
				overflow:$('<div class="vtexlm-likeOverflow"></div>'),
				box:$('<div class="vtexlm-box"></div>')
			};
			
			fn=
			{
				init:function()
				{
					fn.addFbTag();
				},
				addFbTag:function()
				{
					var width;
					
					$this.prepend(e.wrap);
					e.wrap.prepend(e.overflow);
					e.overflow.append(e.box);
					
					// Largura da caixa do Facebook
					if(options.likeWidth=="auto")
						width=$this.outerWidth();
					else
						width=options.likeWidth;
					e.overflow.css({"width":width});
					// e.box.css({"margin-left":options.likeBtWidth*-1});
					
					// Adicionando o controle do Facebook
					e.box.append(options.likeTag
						.replace("#url",$this.find("a[href*='/p']:first").attr("href"))
						// .replace("#width",options.likeBtWidth+width)
						.replace("#width",width)
						.replace("#theme",options.colorTheme)
					);
					
					renderFb();

					// Exibindo o elemento
					e.wrap.slideDown(function(){
						var time,$t,fn
						$t=$(this);
						
						fn=function(){$t.stop().slideUp(showNext);};
						
						time=setTimeout(function(){fn();},options.displayTime);
						
						$t.bind({
							"mouseenter":function(){clearTimeout(time);},
							"mouseleave":function(){fn();}
						});
					});
				}
			};
			
			fn.init();
		};
		
		$this.each(function(){
			items.push($(this));
		});
		
		// items=items.shuffle();
		items=items.sort(function() { return 0.5 - Math.random();});
		
		// Fila de exibição
		showNext=function(){
			if(items.length<1) return;

			var a=items.pop();
			if(typeof a==="object")
				run(a);
			else
			{
				if(i<10) showNext();
				i++;
			}
		};
		
		renderFb();
		setTimeout(function(){
			if(items.length<1) return;
				
			var a=items.pop();
			if(typeof a==="object")
				run(a);
			else
			{
				if(i<10) showNext();
				i++;
			}
		},_default.delay);
		
		return $this;
	};
})(jQuery);

// Array.prototype.shuffle = function() {
  // var i = this.length, j, tempi, tempj;
  // if ( i == 0 ) return false;
  // while ( --i ) {
	 // j       = Math.floor( Math.random() * ( i + 1 ) );
	 // tempi   = this[i];
	 // tempj   = this[j];
	 // this[i] = tempj;
	 // this[j] = tempi;
  // }
  // return this;
// };



$(function(){
	$(".prateleira li").likeometer({
		likeWidth:225,
		colorTheme:"light"
	});
});