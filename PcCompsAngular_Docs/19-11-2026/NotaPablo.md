```text
--------------------------------------------
 PASO DE VALORES ENTRE COMPONENTES ANGULAR
 mediante el uso de señales
--------------------------------------------
- de un COMPONENTE PADRE -----> COMPONENTE HIJO
	- en el componente hijo defines el tipo de valor q quiere recibir desde el componente padre usando señales
	  input<tipo>(); para acceder a sus valores los ejecutas como funciones (como cualquier señal)

		@Component(...)
		export class CompHijo {
			valor1:Signal<tipo> = input<tipo>(); <----- pasado por comp.padre
			valor2:Signal<tipo> = input<tipo>(); <----- pasado por comp.padre
			...

			constructor(){
				console.log('valores pasados por el padre...', valor1(), valor2(),..)
			}

		}

	- en el comp.padre le pasa los valores al comp.hijo como un atributo html q coincide con los nombres de las señales
	"input" definidas en el hijo, y van []. En su vista:

		<app-comp-hijo [valor1]="valor_constante"| {{expresion_ts}}
				[valor2]= "valor_constante"| {{expresion_ts}} ... />

ej: comp.hijo CajaTexto.ts:

	@Component(...)
	export class CajaTexto {
		tipo=input<String>(); <---- prop.cuyo valor lo recibe del comp.padre
		place=input<String>();
		label=input<String>();

	}
  en su vista CajaTexto.html:
	<div>
		<label>{{ label() }}</label>
		<input type={{ tipo() }} placeholder={{ place() }} />
	</div>



en componente padre hay un formulario con un campo email y un campo password, mapeamos con objetos CajaTexto,
en la vista del comp.padre LoginCliente.html, en su código .ts me defino estas variables:
	interface ICajas {
		tipo:String;
		label:String;
		place:String;
	}


	@Component(...)
	export class LoginCliente {
		const camposCajaPassword:{ tipo:String, label:String, place:String } = { tipo:'password', 
					 ------------------------------------------	label:'Contraseña',
							ICajas				place:'tu password es...'
											}
	}


	<div>
		<CajaTexto [label]="Email:" [tipo]="email" [place]="Introduce tu email..." />
		<CajaTexto [label]={{camposCajaPassword.label}}
			   [tipo]={{camposCajaPassword.tipo}}
			   [place]={{camposCajaPassword.place}} .../>
	</div>

----------------------------
- paso de valores COMP.HIJO ----> COMP.PADRE se hace mediante la def. de señales "output<tipo_a_mandar>()" son en realidad eventos
q se definen y disparan en el comp.hijo y en el comp.padre debe haber listeners para dichos eventos y recibir los datos mandados

		@Component(...)
		export class CompHijo {
			evnt1:EventEmitter<tipo> = output<tipo>(); <----- evento a disparar cuando quiero pasar valor a comp.padre
			evnt2:EventEmitter<tipo> = output<tipo>(); <----- evento a disparar cuando quiero pasar valor a comp.padre
			...

			//el comp.hijo dispara el evento cuando le interese y donde le interese:

			evnt1.emit(otrovalor);
			evnt2.emit(otrovalor);
	
		}
en el comp.padre, en su vista html pones el nombre de la señal output entre () pq son eventos y el nombre del método q va a procesarlo, pasando como parámetro variable predefinida $event q recoge el ev.target.value

	<app-com-hijo (evnt1)="HandlerEvent1($event)" (evnt2)="HandlerEvent2($event)" ... />

en código del comp.padre defines esas funciones manejadoras:

	HandlerEvent1(valorRecibido:tipo){
		...
	}

	HandlerEvent2(valorRecibido:tipo){
		...
	}
-----
ej: comp.hijo CajaTexto.ts:

	@Component(...)
	export class CajaTexto {
		tipo=input<String>(); <---- prop.cuyo valor lo recibe del comp.padre
		place=input<String>();
		label=input<String>();
		contenidoCajaEvnt:EventEmitter<String>=output<String>();

		ChangeInput(valorCaja:String){
			contenidoCajaEvent.emit(valorCaja);
		}

	}
  en su vista CajaTexto.html:
	<div>
		<label>{{ label() }}</label>
		<input type={{ tipo() }} placeholder={{ place() }} (change)="ChangeInput($event)"/>
	</div>


 en comp.padre:


	interface ICajas {
		tipo:String;
		label:String;
		place:String;
	}


	@Component(...)
	export class LoginCliente {
		const camposCajaPassword:{ tipo:String, label:String, place:String } = { tipo:'password', 
					 ------------------------------------------	label:'Contraseña',
							ICajas				place:'tu password es...'
		ProcesarTextoCaja(valorRecibido:String){
			console.log('he recibido esto de comp.hijo CajaTexto...', valorRecibido)
		}									}
	}


	<div>
		<CajaTexto [label]="Email:" 
			[tipo]="email" 
			[place]="Introduce tu email..." 
			(contenidoCajaEvent)="ProcesarTextoCaja($event)" />

		<CajaTexto [label]={{camposCajaPassword.label}}
			   [tipo]={{camposCajaPassword.tipo}}
			   [place]={{camposCajaPassword.place}}
			(contenidoCajaEvent)="ProcesarTextoCaja($event)" />
			 .../>
	</div>
------------------------------------------
import { Component, signal, WritableSignal } from '@angular/core';
import { ICajasTexto } from '../../models/ICajasTexto';
@Component({
  imports: [],
  selector: 'app-login-registro',
  styleUrl: './login-registro.css',
  templateUrl: './login-registro.html',
})
export class LoginRegistro {
  enLogin:WritableSignal<boolean> = signal(true);
  cajasTexto:Array<ICajasTexto>=[
        { placeholder: "Nombre", type: "text", id: "nombre", enLogin: false, enRegistro: true },
        { placeholder: "E-mail*", type: "email", id: "email", enLogin: true, enRegistro: true },
        { placeholder: "Contraseña*", type: "password", id: "password", enLogin: true, enRegistro: true },
        { placeholder: "Repetir Contraseña*", type: "password", id: "repassword", enLogin: false, enRegistro: true }    
  ]

SwitchLoginRegistro(){
    this.enLogin.set(!this.enLogin());
  }

  HandleLoginWithGoogle(){

  }

  ChangeFormData(id:string, value:string){

  }

  SubmitForm(){

  }


}
-----------------------
<div class="container">

    <div class="row m-4">
        <div class="col justify-content-center aling-items-center">
            <!-- <IconPc /> -->
        </div>
    </div>
    <div class="row">
        <div class="col-6"><img src="/imagenes/loginRegistro_info.png" class="img-fluid"/></div>
        <div class="col-4">
            <div class="container">
                <!-- {
                    error && <ErrorMessage message={error} />
                } -->
                <div class="row"><div class="col"><h4><strong>{{ enLogin() ? "Iniciar sesión" : "Crear cuenta" }}</strong></h4></div></div>
                <div class="row m-3">
                    <div class="col d-grid gap-1">
                        <button type="button" id="btnlogingmail"  class="btn btn-light btn-sm" (click)="HandleLoginWithGoogle()">
                            <img  src="/imagenes/boton_login_GMAIL.png"/>
                        </button>
                    </div>
                </div>
                <div class="row"><div class="col m-4 d-flex flex-row align-items-center justify-content-center"><h6><span> O bien </span></h6></div></div>
                
                <div class="row">
                    <div class="col">
                        @for( caja of cajasTexto; track caja.id)
                        { 
                                        <div class="form-floating mb-3">
                                            <input  class="form-control"
                                                    [type]="caja.type"                                                     
                                                    [id]="caja.id"
                                                    [placeholder]="caja.placeholder"
                                                    (change)="ChangeFormData(caja.id, $event.target.value)"
                                                    />
                                            <label [for]="caja.id">{{caja.placeholder}}</label>
                                        </div>
                        }@empty{
                            <p>No hay cajas de texto disponibles.</p>
                        }

                        @if( ! enLogin() )
                        {
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label class="form-check-label" for="flexCheckDefault">
                                    He leido y acepto la <a href="">politica de privacidad</a>
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    Recibir <strong>descuento****clusivos</strong>, novedades y tendencias por e-mail. Me puedo dar de baja desde mi panel.
                                </label>
                            </div>                                
                        
                        }   

                        <div class="m-3">
                            <div class="col d-grid gap-1">
                                <button type="button" 
                                         class="btn pccomponentes-primary"
                                         (click)="SubmitForm()">
                                    <span> {{ ! enLogin() ? 'Crear cuenta' : 'Iniciar Sesion' }}</span>
                                </button>
                            </div>
                        </div> 
                    </div>
                </div>    

                <hr/>
                <div class="row">
                    <div class="col m-4 d-flex flex-row align-items-center justify-content-center">
                        <h6><span> {{ enLogin() ? '¿Eres nuevo cliente?':'Ya tengo una cuenta'}} </span></h6>
                    </div>
                </div>

                <div class="row">
                    <div class="col d-grid gap-1">
                        <!-- {
                            isLoading ? 
                                <Spinner /> 
                            :                                                                      -->
                            <button type="button"  
                                    class="btn btn-outline-secondary" 
                                    (click)="SwitchLoginRegistro()">
                                <span> {{ enLogin() ? 'Crear cuenta' : 'Iniciar Sesion' }}</span>
                            </button>
                        <!-- } -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```
