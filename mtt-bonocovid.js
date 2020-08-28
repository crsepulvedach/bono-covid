var BonoCovidMTT =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./src/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const $ = __webpack_require__(1)

/**
 * @typedef {Object} DatosUrlTramiteTypedef
 * @property {boolean} editable - indica si el formulario actual permite la edición y actualización de datos
 * @property {string} accion - ver | editar
 * @property {number} idEtapa - id instancia de la etapa asociada al trámite
 * @property {number} paso - número de paso dentro del flujo secuencial definido para la etapa
 */

/**
 * [jquery] Obtiene el título del formulario desde el 'h1' o 'legend' 
 * dependiendo de la modalidad de vista/edición del formulario 
 * en el flujo
 */
function obtenerTituloFormulario() {
  return $('fieldset legend, form > h1.title:first').text()
}

/** 
 * Otiene el valor del token CrossSiteRequestForgery desde los meta 
 */
function obtenerTokenCSRF() {
  return $('meta[name=csrf-token]').attr('content') || ''
}


/**
 * Transforma el contenido del objeto a un string de modo de hacer factible 
 * su respaldo en los campos de texto. Como background, SIMPLE presenta 
 * problemas al definir el contenido de campos input con objetos JSON serializados
 * @param {string | object} contenido - si es entregado un objeto, se prepara para guardar en el input 
 * sin el último caracter 
 * @returns string
 * @example 
 * // returns "{ 'prop' : 'value' "
 * deshidratar({ 'prop' : 'value' });
 * @example 
 * // returns "[{ 'prop' : 'value' } " 
 * deshidratar([{ 'prop' : 'value' }]);
 */
function deshidratar(contenido) {
  let c = contenido
  if (typeof contenido !== 'string') {
    const str = JSON.stringify(c)
    c = str.substr(0, str.length - 1)
  }
  return c
}


/**
 * Convierte el texto entregado en un objeto asumiendo que el 
 * contenido fue deshidratado usando la función deshidratar actual
 * @param {string} contenido
 * @returns {Object}
 */
function hidratar(contenido) {
  if (typeof contenido !== 'string') {
    throw new Error('tipo del contenido debe ser un string')
  }
  if (contenido === '') return null

  if (!contenido.startsWith('{') && !contenido.startsWith('[')) {
    return JSON.parse(contenido)
  }
  const c = contenido + (contenido.startsWith('{') ? '}' : ']')
  return JSON.parse(c)
}

/** 
 * Obtener html completo del elemento incluyendo la propia etiqueta
 */
function _outerHTML(selector) {
  return $('<div/>').append($(selector).clone()).html()
}

/** Transformar htmlEntities para agregarlas como contenido 'seguro' */
function _encode(str) {
  return $('<div />').text(str).html()
}

/** 
 * Clonado de objetos usando JSON para solventar problemas de "deep copy" 
 * @param {Object} obj 
 * @returns {Object}
 */
function _clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Formato numérico para corregir problemática de locale string en formato español 
 * para cifras con 4 dígitos
 * @param {number} num - número a ser transformado
 */
function _format(num) {
  if (typeof num === 'number') {
    return num.toLocaleString('en', {}).replace(',', '.')
  } else {
    return ''
  }
}

/** 
 * Tranforma la notación de tipo variable lowerCamelCase de modo de hacerla legible en 
 * un texto tipo Title Case
 * @example
 * // returns 'Id Normativa'
 * camelToTitleCase('idNormativa')
 */
function camelToTitleCase(str) {
  return str
    .replace(/[0-9]{2,}/g, match => ` ${match} `)
    .replace(/[^A-Z0-9][A-Z]/g, match => `${match[0]} ${match[1]}`)
    .replace(/[A-Z][A-Z][^A-Z0-9]/g, match => `${match[0]} ${match[1]}${match[2]}`)
    .replace(/[ ]{2,}/g, _ => ' ')
    .replace(/\s./g, match => match.toUpperCase())
    .replace(/^./, match => match.toUpperCase())
    .trim();
}

/**
 * Obtiene la fecha indicada en formato 'yyyy-MM-dd'
 * @param {Date} date 
 */
function toStrDate(date) {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Obtiene la fecha indicada en formato 'hh:mm:ss'
 * @param {Date} date 
 */
function toStrTime(date) {
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const ss = date.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

/**
 * Obtiene la fecha indicada en formato 'yyyy-MM-dd hh:mm:ss'
 * @param {Date} date 
 */
function toStrDatetime(date) {
  return `${toStrDate(date)} ${toStrTime(date)}`
}


/**
 * Extrae desde la url la información de la Etapa actual 
 * @param {string} url 
 * @returns  {DatosUrlTramiteTypedef}
 */
function etapaActual(url = window.location.href) {
  try {
    const regex = /\/etapas\/(ejecutar|ver|ejecutar_fin)\/(\d+)\/?(\d+)?/
    const match = regex.exec(url)
    if (!match) {
      const msg = 'No fue posible identificar el id de etapa: ' + url
      // throw new Error('No fue posible identificar el id de etapa: ' + url)
      console.warn('etapaActual', msg)
      return {}
    }
    const datosUrl = {
      accion: match[1],
      editable: match[1] === 'ejecutar',
      idEtapa: match[2],
      paso: match[1] !== 'ejecutar_fin' ? (match.length > 3 ? match[3] : 0) : null
    }
    return datosUrl
  } catch (error) {
    console.error('obtenerIdEtapa: ' + url, error)
    return {}
  }
}

/**
 * @param {string} contenido - mensaje como contenido del alert
 * @param {string} tipo - asociados a componente alert: primary, secondary, success, danger, warning, info, light, dark  
 */
function agregarNotificacion(contenido, tipo) {
  var tpl = $(`<div class="alert alert-${tipo || 'info'} alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>${contenido}</div>`)
  $('.validacion').append(tpl)
  $([document.documentElement, document.body]).animate({
    scrollTop: $(".validacion").offset().top
  }, 1000);
}

/** 
 * usando URI prueba si la el string entregado corresponde a uri 
 * válida para evitar 404 en carga de archivos usando variables 
 * @param {string} str
 */
function esUrlValida(str) {
  try {
    return new URL(str)
  } catch (_) {
    return null
  }
}


/** 
 * @typedef {Object} CargarRegursoRespTypedef 
 * @property {number} code - 0 en caso de exito
 * @property {string} message - exto descriptivo
 */

/**
 * carga de forma programática de un recurso css o js
 * @param {string} url - url del recurso para ser cargado
 * @param {string} tipo - js, css
 * @returns {Promise<CargarRegursoRespTypedef>}
 */
function cargarRecurso(url, tipo) {
  return new Promise((resolve) => {
    const resourceUrl = esUrlValida(url)
    if (resourceUrl === null) {
      resolve({ code: 1, message: `url '${url}' no válida para carga, no se inicia carga recurso` })
    };
    try {
      const tipoArchivo = tipo || resourceUrl.pathname.split('.').pop();
      console.log(`Cargar archivo '${tipoArchivo}' desde ${url}`);
      let newNode = null;
      switch (tipo) {
        case 'js':
          newNode = document.createElement('script');
          newNode.setAttribute('src', url);
          newNode.setAttribute('type', 'text/javascript');
          break;
        case 'css':
          newNode = document.createElement('link');
          newNode.setAttribute('href', url);
          newNode.setAttribute('rel', 'stylesheet');
          newNode.setAttribute('type', 'text/css');
          break;
        default:
          return;
      }
      newNode.onload = function () { resolve({ code: 0, message: `recurso '${url}' cargado` }) };
      newNode.onerror = function (err) { resolve({ code: 2, message: `Error al cargar recurso '${url}' : ${err.message}` }) };
      document.getElementsByTagName("head")[0].appendChild(newNode);
    } catch (error) {
      resolve({ code: 2, message: `Error no controlado al cargar recurso '${url}' : ${error.message}` })
    }
  })
}


module.exports = {
  obtenerTokenCSRF,
  agregarNotificacion,
  etapaActual,
  obtenerTituloFormulario,

  deshidratar,
  hidratar,

  _outerHTML,
  _encode,
  _clone,
  _format,

  camelToTitleCase,

  toStrDate,
  toStrTime,
  toStrDatetime,

  esUrlValida,
  cargarRecurso
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { cambiarEstiloTextbox, usarInputComoHidden } = __webpack_require__(8)
const { DropdownSimpleUI } = __webpack_require__(16)
const { S3InputFileUploader } = __webpack_require__(3)
const { S3UrlFileUploader } = __webpack_require__(17)
const { GestorDocumentacion } = __webpack_require__(18)


module.exports = {
  cambiarEstiloTextbox,
  usarInputComoHidden,

  DropdownSimpleUI,
  GestorDocumentacionSimpleUI: GestorDocumentacion,

  S3InputFileUploader,
  S3UrlFileUploader
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(4)
const utils = __webpack_require__(0)
const $ = __webpack_require__(1)

/**
 * @typedef {Object} S3InputFileUploaderOpsTypedef
 * @property {number} idEtapa - identificador de etapa usado para regisgtrar archivo en repositorio S3 de SIMPLE
 * @property {number} maxSize - tamaño máximo por omisión, en bytes (8)
 * @property {number} chunkSize - tamaño máximo de la partición definido: 5242880, 6291456, 8388608
 * @property {string} baseUrl - url el servidor de trabajo 
 * @property {string} token - token CSRF usado en encabezado de POST para servicio
 */

/** @type {S3InputFileUploaderOpsTypedef} */
const S3_FILE_UPLOADER_DEFAULTS = {
  idEtapa: utils.etapaActual().idEtapa,
  maxSize: 5242880, // rebajado a 5MB para todos los trámites, 10485760,
  chunkSize: 5242880, // tamaños permitidos, otros fallan : 5242880, 6291456, 8388608
  // singleFileMaxSize: 5242800, // cambiado para usar solo el tamaño de chunk
  baseUrl: `${window.location.protocol}//${window.location.host}`,
  token: utils.obtenerTokenCSRF()
}


/** Administra la carga del documento al repositorio indicando avances y errores para ser usados en la modificación de la UI */
class S3InputFileUploader {

  /**
   * @param {any} inputfile - input type=file conteniendo el archivo seleccionado
   * @param {S3InputFileUploaderOpsTypedef} cfg - configuraciones
   */
  constructor(idCampo, inputfile, cfg) {
    /** @type {S3InputFileUploaderOpsTypedef} */
    this.cfg = Object.assign({}, S3_FILE_UPLOADER_DEFAULTS, cfg || {})
    this.idCampo = idCampo
    const self = this
    this._$inputFile = $(inputfile)
    this._$inputFile.on('change', function (evt) {
      if (!this.files || this.files.length <= 0) {
        return
      }
      $(this).trigger('load-start')
      self.uploadFile(this.files[0])
        .catch(err => console.log('error', err))
    })
  }

  /**
   * @param {Blob} file 
   */
  async uploadFile(file) {
    const totalSize = file.size
    let totalSegments = 1

    if (totalSize > this.cfg.maxSize) {
      this._$inputFile.trigger('error', { message: `Tamaño del archivo (${utils._format(totalSize)} bytes) supera el máximo permitido (${utils._format(this.cfg.maxSize)} bytes)` })
      return
    }
    if (totalSize > this.cfg.chunkSize) {
      const rest = totalSize % this.cfg.chunkSize
      totalSegments = ((totalSize - rest) / this.cfg.chunkSize) + (rest > 0 ? 1 : 0)
    }

    let fileUrl = ''
    for (let segmentNumber = 1; segmentNumber <= totalSegments; segmentNumber++) {
      const chunk = await this._getFileSegment(file, segmentNumber, totalSegments, this.cfg.chunkSize)
      const chunkLoaded = await this._uploadSegment(chunk)
      fileUrl = chunkLoaded.url
    }

    return {
      name: file.name,
      size: file.size,
      contentType: file.type,
      url: fileUrl,
      urlOrig: null
    }
  }

  /**
   * @param {S3ChunkTypedef} chunk 
   */
  _getSegmentUploadUrl(chunk) {
    const { totalSegments, segmentNumber } = chunk
    const { baseUrl, idEtapa } = this.cfg
    const urlParts = [baseUrl + '/uploader/datos_s3', this.idCampo, idEtapa]
    urlParts.push(totalSegments > 1 ? 'multi' : 'single')
    urlParts.push(...[segmentNumber, totalSegments])
    return urlParts.join('/')
  }

  /**
   * @param {any} file 
   * @param {number} segmentNumber 
   * @param {number} chunkSize 
   * @return {Promise<S3ChunkTypedef>}
   */
  async _getFileSegment(file, segmentNumber, totalSegments, chunkSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const initialPos = chunkSize * (segmentNumber - 1)
      const content = file.slice(initialPos, initialPos + chunkSize)
      const chunk = {
        totalSize: file.size,
        size: content.size,
        segmentNumber,
        filename: file.name,
        contentType: file.type,
        totalSegments
      }
      reader.onload = (evt) => {
        if (evt.target.error) {
          reject(evt.target.error)
        } else {
          chunk.content = evt.target.result
          resolve(chunk)
        }
      }
      reader.readAsArrayBuffer(content);
    })
  }

  _calculateUploadProgress(segmento, tamanoParticion, porcionCargada, contenidoTotal) {
    const totalCargado = (segmento - 1) * tamanoParticion + porcionCargada
    return Math.round((totalCargado * 100) / contenidoTotal)
  }

  /**
   * @param {S3ChunkTypedef} chunk 
   */
  async _uploadSegment(chunk) {
    const self = this
    return new Promise((resolve, reject) => {
      var uploadUrl = this._getSegmentUploadUrl(chunk)
      var xhr = new XMLHttpRequest();
      var content = new Uint8Array(chunk.content);

      xhr.upload.addEventListener("progress", function (chunkNumber, totalSegments, chunkSize, totalSize) {
        return function (evt) {
          const totalLoaded = self._calculateUploadProgress(chunkNumber, self.cfg.chunkSize, evt.loaded, totalSize)
          self._$inputFile.trigger('progress', { chunkNumber, totalSegments, chunkSize, totalSize, chunkLoaded: evt.loaded, totalLoaded })
        }
      }(chunk.segmentNumber, chunk.totalSegments, content.byteLength, chunk.totalSize));

      xhr.addEventListener('load', function (chunkNumber, totalSegments, filename, totalSize) {
        return function (evt) {
          try {
            if (evt.target.status === 200) {
              const uploadStatus = JSON.parse(evt.target.response);
              if (!uploadStatus.success) {
                console.error(`Servidor informa error segmento ${chunkNumber}`, uploadStatus.error);
                self._$inputFile.trigger('error', [{ message: uploadStatus.error }])
              } else {
                const uploadedFile = {
                  segmentNumber: chunkNumber,
                  totalSegments,
                  name: filename,
                  url: `${self.cfg.baseUrl}${uploadStatus.URL}`,
                  contentType: chunk.contentType,
                  totalSize
                }
                self._$inputFile.trigger(chunkNumber === totalSegments ? 'complete' : 'partial', [uploadedFile])
                resolve(uploadedFile)
              }
            } else {
              throw new Error('Error en la carga servidor informa STATUS=' + evt.target.status)
            }
          } catch (e) {
            self._$inputFile.trigger('error', [{ message: e.message, evt }])
            reject(e)
            return;
          }
        }
      }(chunk.segmentNumber, chunk.totalSegments, chunk.filename, chunk.totalSize));

      xhr.addEventListener("error", function (evt) {
        console.error('Error al enviar', evt);
        self._$inputFile.trigger('error', [evt])
        reject(evt)
      });

      xhr.addEventListener("abort", function (evt) {
        console.error('Abortado al enviar', evt)
        self._$inputFile.trigger('abort', [evt])
        resolve(null)
      });

      xhr.open("POST", uploadUrl, true);
      xhr.setRequestHeader('X-CSRF-TOKEN', this.cfg.token);
      xhr.setRequestHeader('filename', encodeURI(chunk.filename));
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.send(content);

    })
  }

}

module.exports = {
  S3_FILE_UPLOADER_DEFAULTS,
  S3InputFileUploader
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {


/**
 * Datos del documento solicitado para ser desplegado como listado
 * @typedef {Object} DocumentoSolicitadoTypedef
 * @property {string} nombre - nombre del documento
 * @property {number|string} codigo - valor o código asociado
 * @property {string} descripcion - descripción alternativa
 * @property {boolean} esObligatorio - obligatorio u opcional
 */

/**
 * @typedef {Object} GrupoDocumentacionTypedef
 * @property {string} idGrupo - identificador de grupo conceptual para el cual se cargan los documentos (ej: patente, rut, solicitante u otro con el que se pueda identificar únicamente)
 * @property {string} titulo - título cabecera del grupo, se usará el idGrupo en caso de no especificarse
 * @property {string[]} checklist - listado de textos mostrados como checklist en el encabezado del grupo
 * @property {DocumentoSolicitadoTypedef[]} documentos - listado de documentos solicitados incluyendo opcionales y requeridos
 */


/**
 * Porcion de archivo dada la necesidad de parcializar los documentos en segmentos
 * @typedef {Object} S3ChunkTypedef
 * @property {number} segmentNumber
 * @property {number} totalSegments
 * @property {number} size
 * @property {number} totalSize
 * @property {string} filename
 */

/**
 * Datos del documento cargado a S3
 * @typedef {Object} S3UploadedDocumentTypedef
 * @property {string} name - filename
 * @property {string} url -  en S3
 * @property {string} urlOrig -  en caso de haber sido cargado desde otra url
 * @property {string} contentType - content type
 * @property {tamano} size - bytes
 */

/**
 * @typedef {object} _BlobFile
 * @property {string} name - nombre del archivo
 * @property {string} url - url en caso de haber sido descargado por url
 */

/**
 * @typedef {Blob | _BlobFile} BlobFile
 */


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(14)

const utils = __webpack_require__(0)
const core = __webpack_require__(2)
const exedoc = __webpack_require__(19)
const tgr = __webpack_require__(20)
const pet = __webpack_require__(21)
const ga = __webpack_require__(22)

const $ = __webpack_require__(1)

$(document).ready(function () {
  document.title = 'SUBTRANS - ' + utils.obtenerTituloFormulario()
  if (!utils.etapaActual().editable) {
    $('.campo.control-group input.form-control, .campo.control-group .form-check-input').attr('disabled', 'disabled')
  }
})

module.exports = {
  utils,
  core,
  exedoc,
  tgr,
  pet,
  ga
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const $ = __webpack_require__(1)

/** 
 * Preparar campo para usarlo como campo estado ocultandolo de la vista.
 * El elemento en SIMPLE seguirá siendo un componente textbox. 
 * @param {string} nombreCampo - nombre asignado al campo en SIMPLE
 * @returns {JQuery<HTMLElement>}
 */
function usarInputComoHidden(nombreCampo) {
  const $t = $(`input[name=${nombreCampo}]`)
  $t.attr('type', 'hidden')
  const $w = $t.closest('.campo.control-group')
  // $w.removeAttr('data-dependiente-campo')
  $w.find('.help-block, .control-label').hide()
  return $t
}


/**
 * @typedef {Object} OpcionesCambiarEstiloTextboxTypedef
 * @property {boolean} ocultarEtiqueta - ocultar etiqueta de campo
 */

/** @type  {OpcionesCambiarEstiloTextboxTypedef} */
const DEFAULTS_CAMBIAR_ESTILO_TEXTBOX = {
  ocultarEtiqueta: true
}

/**
 * Convertir elemento a estructura Material para mejorar diseño
 * @param {string} nombre - nombre del elemento
 * @param {string} iconoMaterial -  nombre del icono en Material-Icons [ fingerprint | business | account_circle | email }
 * @param {OpcionesCambiarEstiloTextboxTypedef} opciones
 */
function cambiarEstiloTextbox(nombre, iconoMaterial, opciones) {
  const opts = Object.assign({}, DEFAULTS_CAMBIAR_ESTILO_TEXTBOX, opciones)
  try {
    const $elm = $(`[name=${nombre}]`)
    const $grupo = $elm.closest('.form-group')
    const $label = $grupo.find('label, .help-block')
    const $icon = $(`<span class="input-group-addon"><i class="material-icons">${iconoMaterial}</i></span>`)
    $grupo.addClass('input-group')
    if (opts.ocultarEtiqueta) {
      $label.first().after($icon)
      $label.remove()
    } else {
      $grupo.parent().prepend($label.remove())
      $grupo.prepend($icon)
    }
    return $elm
  } catch (error) {
    console.warn(`cambioEstiloElemento ${nombre}`, error)
  }
}

module.exports = {
  usarInputComoHidden,
  cambiarEstiloTextbox
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(10)

const propietario = __webpack_require__(12)

const SimpleMTT = __webpack_require__(7)

// agregar aquí las bibliotecas particulares de los trámites 
const BonoCovidMTT = {
  propietario
}

module.exports = Object.assign(
  BonoCovidMTT,
  SimpleMTT
)

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(5);
            var content = __webpack_require__(11);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".campo.control-group{font-size:15px;text-align:justify}.campo.control-group .form-group>label{font-weight:bold}.campo.control-group label.control-label{font-weight:bold}.ajaxForm .controls.grid-Cls.grilla_hide_paginate .dataTables_paginate,.ajaxForm .controls.grid-Cls.grilla_hide_filter .dataTables_filter,.ajaxForm .controls.grid-Cls.grila_hide_info .dataTables_info,.ajaxForm .controls.grid-Cls.grila_hide_length .dataTables_length,.controls.grid-Cls.grilla_hide_paginate .dataTables_paginate,.controls.grid-Cls.grilla_hide_filter .dataTables_filter,.controls.grid-Cls.grila_hide_info .dataTables_info,.controls.grid-Cls.grila_hide_length .dataTables_length{display:none}.ajaxForm .controls.grid-Cls .dataTables_wrapper .dataTables_paginate,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate{font-size:12px}.ajaxForm .controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover,.ajaxForm .controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current{border-color:#0069ef !important;background-color:#0069ef !important;background:#0069ef !important}.ajaxForm .controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover{border-color:#0069ef !important;background-color:#2384ff !important;background:#2384ff !important}.ajaxForm .controls.grid-Cls .container .row:last-child div,.controls.grid-Cls .container .row:last-child div{text-align:right;width:100%}.ajaxForm .controls.grid-Cls .btn.btn_grid_action,.controls.grid-Cls .btn.btn_grid_action{margin-left:5px !important;padding:0}.ajaxForm .controls.grid-Cls table.dataTable thead th,.ajaxForm .controls.grid-Cls table.dataTable thead td,.controls.grid-Cls table.dataTable thead th,.controls.grid-Cls table.dataTable thead td{border-bottom:#0069ef !important;background-color:#0069ef !important;font-size:12px}.modalgrid .modal-header,.ajaxForm .modalgrid .modal-header{background-color:#0069ef;color:#fff}.conductores-por-vehiculo .card.ppu .card-body{min-height:unset}.conductores-por-vehiculo hint{font-size:13px;font-style:italic}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const listadoConductores = __webpack_require__(13)
const helpersPropietario = __webpack_require__(23)

module.exports = {
  documentosRepresentante: helpersPropietario.documentosRepresentante,
  grillaExternaDatosIniciales: helpersPropietario.grillaExternaDatosIniciales,
  datosPrecargaTabla: helpersPropietario.datosPrecargaTabla,

  ConductoresPorVehiculoUI: listadoConductores.ConductoresPorVehiculoUI
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const { core } = __webpack_require__(7)
const $ = __webpack_require__(1)
const utils = __webpack_require__(0)

class ConductoresPorVehiculoUI {

  /**
   * @param {string} nombreCampo 
   * @param {ConductoresPorVehiculosPpuTypedef[]} datos 
   */
  constructor(nombreCampo, datos) {
    this.$target = core.usarInputComoHidden(nombreCampo)
    const anterior = utils.hidratar(this.$target.val() || '')
    this.ppus = [...datos]
    this._dibujar()
    this._restablecer(anterior)
    this._actualizarCampoEstado()
  }

  _restablecer(anterior) {
    console.log('anterior', anterior)
  }

  _actualizarCampoEstado() {
    const seleccion = this.ppus.filter(p => p._postular && p._postular != null)
    if (seleccion && seleccion.length) {
      this.$target.val(utils.deshidratar(seleccion))
    } else {
      this.$target.val('')
    }
  }

  _dibujar() {
    this.$wrapper = $('<div class="conductores-por-vehiculo">')
    if (this.ppus && this.ppus.length) {
      this._cuposAdicionales = this.ppus.filter(p => p.cancelada).length
      this._agregarVehiculos(this.$wrapper, this.ppus)
      // this._agregarVehiculosTabla(this.$wrapper, this.ppus)
    }

    this.$target.closest('.campo.control-group').append(this.$wrapper)
  }

  /**
   * 
   * @param {jQuery<HTMLElement>} wrapper 
   * @param {ConductoresPorVehiculosPpuTypedef[]} ppus 
   */
  _agregarVehiculos(wrapper, ppus) {
    ppus.filter(v => !v.postulada).forEach(v => this._agregarVehiculo(wrapper, v))
  }

  /**
   * @param {ConductoresPorVehiculosPpuTypedef} v 
   */
  _agregarVehiculo(contenedor, v) {
    const idPart = v.ppu
    // <input type="checkbox" name="postular" id="postular${idPart}" value="${v.ppu}" class="chk-postular" />
    const $vehiculo = $(`
    <div class="card ppu" data-ppu="${v.ppu}">
      <div class="card-header">
        <div>Placa patente: <span>${v.ppu}</span></div>
        <div><input type="checkbox" name="postular" id="postular${idPart}" value="${v.ppu}" class="chk-postular" /></div></div>
      <div class="card-body">        
        <div class="form-row">          
        </div>
      </div>
    </div>`)
    const $form = $vehiculo.find('.form-row')
    console.log(v)
    if (!v.restriccion) {
      $form.append(this._crearCampoConductores(idPart, v.conductores, 5))
      $form.append(this._crearCampoEmail(idPart, 4))
      $form.append(this._crearCampoTelefono(idPart, 3))
    } else {
      $form.append(this._crearCampoRUT(idPart, 3))
      $form.append(this._crearCampoEmail(idPart, 6))
      $form.append(this._crearCampoTelefono(idPart, 3))
    }

    contenedor.append($vehiculo)
  }

  _crearCampoTelefono(idPart, cols) {
    const tpl = `
    <div class="form-group col-md-${cols}">
      <label for="${idPart}_telefono">Teléfono</label>
      <input type="phone" class="form-control" maxlength="9"  id="${idPart}_telefono">
      <hint>ej: 9 82 608 604</hint>
    </div>`
    return $(tpl)
  }

  _crearCampoEmail(idPart, cols) {
    const tpl = `
    <div class="form-group col-md-${cols}">
      <label for="${idPart}_email">Email</label>
      <input type="email" class="form-control" maxlength="60"  id="${idPart}_email">
      <hint></hint>
    </div>`
    return $(tpl)
  }

  _crearCampoRUT(idPart, cols) {
    const tpl = `
    <div class="form-group col-md-${cols}">
      <label for="${idPart}_rut">RUN</label>
      <input type="text" class="form-control" maxlength="10"  id="${idPart}_rut">
      <hint>ej: 12345567-K</hint>
    </div>`
    return $(tpl)
  }

  /**
   * @param {string} idPart 
   * @param {ConductoresPorVehiculosPersonaTypedef[]} conductores 
   */
  _crearCampoConductores(idPart, conductores, cols) {
    const tpl = `
    <div class="form-group col-md-${cols}">
      <label for="${idPart}_conductores">RUN</label>
      <select class="form-control" id="${idPart}_rut"><option>-- Seleccione --</option></select>
      <hint></hint>
    </div>`
    const $w = $(tpl)
    const $s = $w.find(`#${idPart}_rut`)
    conductores.forEach(c => $s.append(`<option value='${c.nombre}'>${c.nombre} (${c.rut})</option>`))
    return $w
  }
}

module.exports = {
  ConductoresPorVehiculoUI
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(5);
            var content = __webpack_require__(15);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.form-actions{margin-top:50px !important}.spin{animation-name:spin;animation-duration:1500ms;animation-iteration-count:infinite;animation-timing-function:linear}.nowrap{white-space:nowrap !important}.unselectable{user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}h1.title,fieldset legend{text-transform:uppercase;color:#000;font-family:Roboto Slab,sans-serif;font-size:28px}fieldset legend{border-bottom:1px solid rgba(9,19,46,.1);padding-bottom:1rem;line-height:37px;margin-bottom:0}.campo.control-group h3,.campo.control-group h4{text-transform:uppercase;padding:1rem 0;margin:3rem 0 1rem 0;border:0;border-top:1px solid rgba(9,19,46,.1);border-bottom:1px solid rgba(9,19,46,.1)}.campo.control-group .input-group small{min-width:50px;padding-left:5px}.campo.control-group .datos-tramite{font-family:monospace;padding:0;background-color:#fdfdfd;margin:0}.campo.control-group .datos-tramite .tramite-nombre,.campo.control-group .datos-tramite .tramite-id{font-size:18px;text-transform:uppercase;text-align:justify;display:inline-block;font-weight:bold}.campo.control-group .alert{text-align:justify}.campo.control-group .alert ul{padding-left:15px}.campo.control-group .alert.alert-text-large{font-size:large}.campo.control-group .alert.alert-text-medium{font-size:medium}i.material-icons{font-size:24px;vertical-align:sub}.input-group{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-addon{border-right:0;padding:3px 10px;color:#0069ef;font-size:14px;font-weight:400;line-height:1;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px;white-space:nowrap;vertical-align:middle;border-top-right-radius:0;border-bottom-right-radius:0}.controls.grid-Cls{font-size:inherit}.controls.grid-Cls .container .row:last-child div{text-align:right;width:100%}.controls.grid-Cls .btn.btn_grid_action{margin-left:5px !important;padding:0}.controls.grid-Cls .dataTables_filter,.controls.grid-Cls .dataTables_length,.controls.grid-Cls .dataTables_paginate,.controls.grid-Cls .dataTables_info{display:none}.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover,.controls.grid-Cls .dataTables_wrapper .dataTables_paginate .paginate_button:hover{color:#fff !important;border:1px solid #0069ef;background-color:#0069ef !important;background:#0069ef !important;border-radius:18px}.controls.grid-Cls table.dataTable thead th,.controls.grid-Cls table.dataTable thead td{border-bottom:#0069ef !important;background-color:#0069ef !important;font-size:12px}.modalgrid .modal-header{background-color:#0069ef;color:#fff}.pasos{cursor:default}.pasos.row{margin-top:10px}.pasos .linea1,.pasos .linea2{font-size:15px;text-align:justify}.pasos .linea2{font-style:italic;text-align:justify}.pasos .paso{background:red;border-radius:.8em;-moz-border-radius:.8em;-webkit-border-radius:.8em;opacity:.3;color:#fff;display:inline-block;font-size:17px;font-weight:bold;line-height:1.6em;text-align:center;width:1.6em;-webkit-box-shadow:7px 7px 5px 0px rgba(50,50,50,.75);-moz-box-shadow:7px 7px 5px 0px rgba(50,50,50,.75);box-shadow:7px 7px 5px 0px rgba(50,50,50,.75);margin:9px 15px 0 0;padding:0}.pasos .paso.activo{opacity:1}.campo.control-group .upload-documentos h3{border:none;margin:0}.upload-documentos{width:100%;margin-top:50px;background-color:#fbfbfb;padding:5px 15px;border-radius:3px;border:1px dotted #d2d2d2}.upload-documentos .resumen{margin-top:14px;background-color:#fff;border:1px dashed #eaeaea;border-radius:6px;font-size:14px}.upload-documentos .resumen ul{padding:8px 13px;margin:0}.upload-documentos .resumen ul li{display:flex;align-items:center}.upload-documentos .resumen ul li.check .material-icons{color:green;margin-right:5px}.upload-documentos .resumen ul li .material-icons{font-size:12px;margin-right:5px}.upload-documentos .titulo-grupo{font-size:22px;text-decoration:underline}.upload-documentos thead th{padding-top:25px;text-transform:uppercase}.upload-documentos thead th .titulo-obligatoriedad{text-transform:capitalize;font-weight:normal;margin:0;padding:0;border:none;font-size:20px}.upload-documentos tr{cursor:default}.upload-documentos tr.hoverable:hover{background-color:#ededed}.upload-documentos tr.error td.estado{color:red}.upload-documentos tr.error td.estado i.check{display:none}.upload-documentos tr.error td.estado i.error{display:inline-block}.upload-documentos tr td{padding:9px 3px 3px 3px;vertical-align:top;border-top:1px dotted #d0cccc}.upload-documentos tr td.estado{color:#c2c2c2}.upload-documentos tr td.estado i.material-icons{margin:3px 5px}.upload-documentos tr td.estado i.check{display:inline-block}.upload-documentos tr td.estado i.error{display:none}.upload-documentos tr td.documento>span{display:block}.upload-documentos tr td.documento span.nombre{font-size:16px;color:#000}.upload-documentos tr td.documento span.desc{font-size:13px;font-style:italic;color:#646464}.upload-documentos tr td.documento a.filename{font-family:\"Courier New\",Courier,monospace;font-size:14px;border-top:1px dashed;width:100%;display:none;margin-top:8px;padding-top:7px}.upload-documentos tr td.documento a.link-archivo{display:none;align-items:center;justify-content:right}.upload-documentos tr td.documento a.link-archivo *{padding-right:4px;display:inline-block}.upload-documentos tr td.documento a.link-archivo i{text-decoration:none}.upload-documentos tr td.documento .uploader-bar{visibility:hidden;display:block;background-color:#e0e0e0;border-radius:5px;height:5px}.upload-documentos tr td.documento .uploader-bar .uploader-bar-progress{display:block;background-color:#0054ab;width:0%;border-radius:5px;height:5px}.upload-documentos tr td.acciones{width:1%;white-space:nowrap}.upload-documentos tr td.acciones button{margin:0 2px;padding:3px 5px}.upload-documentos tr td.acciones button.replace,.upload-documentos tr td.acciones button.uploading{display:none}.upload-documentos tr td.acciones button.remove{visibility:hidden}.upload-documentos tr td.acciones button.upload{display:inline-block}.upload-documentos tr.uploaded td.estado{color:green}.upload-documentos tr.uploaded td.acciones button.replace{display:inline-block}.upload-documentos tr.uploaded td.acciones button.remove{visibility:visible}.upload-documentos tr.uploaded td.acciones button.upload{display:none}.upload-documentos tr.uploaded td.documento a.link-archivo{display:inline-flex}.upload-documentos tr.uploading td.acciones button.uploading{display:inline-block}.upload-documentos tr.uploading td.acciones button.replace,.upload-documentos tr.uploading td.acciones button.upload{display:none}.upload-documentos tr.uploading td.documento .uploader-bar{visibility:visible}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const $ = __webpack_require__(1)

/**
 * @typedef {Object} DropdownSimpleOpsTypedef
 * @property {string} propEtiqueta - nombre de la propiedad en el objeto usado como etiqueta del campo
 * @property {string} propValor - nombre de la propiedad en el objeto usada como valor del campo
 * @property {string} valorComo - forma en que se guarda el valor en el campo destino object|value
 * @property {string} textoSeleccionar - texto que aparecerá como primer valor en caso de que el Select no tenga valor
 * @property {number} habilitaBusqueda - cantidad de elementos máxima presentada sin habilitar la búsqueda
 */

/**
 * @type {DropdownSimpleOpsTypedef}
 */
const DEFAULTS_DROPDOWN_SIMPLE = {
  propEtiqueta: 'etiqueta',
  propValor: 'valor',
  valorComo: 'object', // 'object', 'value',
  textoSeleccionar: 'Seleccione',
  habilitaBusqueda: 5 // -1 search disabled
}

class DropdownSimpleUI {
  /**
   * 
   * @param {string} nombreCampo 
   * @param {any[]} listaDatos 
   * @param {any} valorInicial 
   * @param {DropdownSimpleOpsTypedef} opciones 
   */
  constructor(nombreCampo, listaDatos, valorInicial, opciones) {
    const elm = $(`[name='${nombreCampo}']`)
    if (elm.length) {
      this.$elmRef = elm[0]
      this.listadoDatos = listaDatos
      this.valorInicial = valorInicial

      /** @type {DropdownSimpleOpsTypedef} */
      this.opts = Object.assign({}, DEFAULTS_DROPDOWN_SIMPLE, opciones || {})
      this._dibujar()
    } else {
      throw new Error(`elemento de formulario no encontrado '${nombreCampo}'`)
    }
  }

  /** 
   * Obtener el valor del elemento dependiendo del tipo y la configuracion 
   * relativa al estilo seleccion 'valorComo' 
   */
  _getValorElemento(elm) {
    if (typeof elm === 'object') {
      return elm[this.opts.propValor] + ''
    } else {
      return elm + ''
    }
  }

  /** 
    * Obtener el valor usado para mostrar como etiqueta del elemento indicado dependiendo tipo 
    * y configuracion relativa al estilo selección 'valorComo' 
    */
  _getTextoEtiqueta(elm) {
    if (typeof elm === 'object') {
      if (typeof this.opts.propEtiqueta === 'function') {
        return this.opts.propEtiqueta(elm)
      }
      else {
        return elm[this.opts.propEtiqueta]
      }
    } else {
      return elm
    }
  }

  /**
   * comparación de dos elementos a y b en torno a su valor
   * usando configuración relativa a 'valorComo'
   * @param {any} a 
   * @param {any} b 
   */
  _valoresIguales(a, b) {
    return this._getValorElemento(a) === this._getValorElemento(b)
  }

  /** 
   * despliega el elemento en pantalla según el tipo de elemento referenciado 
   */
  _dibujar() {
    if (this.$elmRef.nodeName === 'SELECT') {
      this.$formElement = this._transformarElemento(this.$elmRef)
    } else {
      this.$formElement = this._crearElemento()
    }
  }

  _agregarOptions(select, items, selected, placeholderText) {
    const $select = $(select)
    $select.append(`<option value=''>${placeholderText}</option>`)
    items.forEach(item => {
      const valueEquals = this._valoresIguales(item, selected)
      const opt = $(`<option value='${this._getValorElemento(item)}' ${valueEquals ? 'selected' : ''}>${this._getTextoEtiqueta(item)}</option>`)
      $select.append(opt)
    });
  }

  _transformarElemento(elm) {
    const $elm = $(elm)
    const selectedValue = $elm.val() || this.valorInicial
    $elm.empty()
    this._agregarOptions(elm, this.listadoDatos, selectedValue, this.opts.textoSeleccionar)
    // forzar redibujo para tomar nuevas opciones
    $elm.chosen('destroy').chosen({
      disable_search_threshold: this.opts.habilitaBusqueda > 0 ? this.opts.habilitaBusqueda : 999999
    })
    return $elm
  }

  _crearElemento() {
    const $select = $(`<select id='${DropdownSimpleUI._name}_${this.$elmRef.attr('name')}' class="form-control form-control-chosen"  data-placeholder="${this.opts.textoSeleccionar}"></select>`)
    this._agregarOptions($select, this.listadoDatos)
    $select.chosen()
    return $select
  }
}

DropdownSimpleUI._name = 'DropdownSimpleUI'

module.exports = {
  DropdownSimpleUI
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(4)
const $ = __webpack_require__(1)
const { S3_FILE_UPLOADER_DEFAULTS } = __webpack_require__(3)
const utils = __webpack_require__(0)

// TODO: extraer lógica de carga del documento de modo de usarla en otros componentes 
// sin replicar código

const S3_URL_FILE_UPLOADER_DEFAULTS = {
  metodo: 'GET'
}

/**
 * Componente que permite efectuar una carga de un documento generado en SIMPLE usando el idCampo asociado
 * y llevarlo al repositorio de SIMPLE de modo de dejarlo disponible para descarga.
 */
class S3UrlFileUploader {

  /**
  * @param {number|string} refCampo - asociado al campo Documento agregado aal formulario desde donde se extraerá la url 
  * @param {} options 
  */
  constructor(refCampo, options) {
    this.cfg = Object.assign({}, S3_FILE_UPLOADER_DEFAULTS, S3_URL_FILE_UPLOADER_DEFAULTS, options || {})
    this.refCampo = refCampo

    if (typeof refCampo === 'string') {
      this._$btn = $(`a.btn:contains(${refCampo})`)
    } else {
      this.idCampo = refCampo
      this._$btn = $(`[data-id=${refCampo}] a.btn`)
    }

    if (!this._$btn) {
      throw new Error(`Campo ${refCampo} no fue en encontrado dentro del formulario`)
    }

    if (typeof refCampo === 'string') {
      this.idCampo = parseInt(this._$btn.closest('.campo.control-group').attr('data-id'), 10)
    }
  }

  /** 
   * Descargar documento y agregarlo al repositorio de SIMPLE 
   * @param {string} nombreArchivo - nombre opcional para renombrar documento descargado al momento de 
   * cargarlo al repositorio de SIMPLE
   */
  async addFileToRepo(nombreArchivo) {
    this.url = this._$btn.attr('href')
    if (!this.url) {
      throw new Error(`El campo ${this.refCampo} (${typeof this.refCampo}) no posee una url válida para efectuar la descarga del docuemnto.`)
    }
    const file = await this.downloadFileContent(this.url)
    file.name = nombreArchivo || file.name
    return this._uploadFile(file, nombreArchivo)
  }

  /**
   * Descargar desde la url el contenido del archivo
   * @param {string} url 
   * @returns {Promise<BlobFile>}
   */
  async downloadFileContent(url) {
    if (!url) throw new Error(`S3UrlFileUploader: debe especificar una url para la descarga del documento original`)
    if (!utils.esUrlValida(url)) throw new Error(`S3UrlFileUploader: La url '${url}' no es válida`)
    console.log('downloadFileContent', url)
    return new Promise((res, _rej) => {
      var oReq = new XMLHttpRequest();
      oReq.open(this.cfg.metodo, url, true);
      oReq.responseType = "blob";
      oReq.onload = function (oEvent, oReqRef) {
        var blob = oReq.response;
        const regex = /filename="(.*)"/g
        if (blob) {
          blob.name = regex.exec(oReq.getResponseHeader('content-disposition'))[1]
          blob.url = url
          res(blob)
        }
      };
      oReq.send();
    })
  }

  /**
   * envio de documento a repositorio S3 usando SIMPLE
   * @param {BlobFile} file - un objeto Blobl con información del archivo a cargar
   * @returns {Promise<S3UploadedDocumentTypedef>}
   */
  async _uploadFile(file) {
    const totalSize = file.size
    let totalSegments = 1
    if (totalSize > this.cfg.maxSize) {
      throw new Error(`Tamaño del archivo supera el máximo permitido`)
    }
    if (totalSize > this.cfg.chunkSize) {
      const rest = totalSize % this.cfg.chunkSize
      totalSegments = ((totalSize - rest) / this.cfg.chunkSize) + (rest > 0 ? 1 : 0)
    }
    let urlSIMPLE = ''
    for (let segmentNumber = 1; segmentNumber <= totalSegments; segmentNumber++) {
      const chunk = await this._getFileSegment(file, segmentNumber, totalSegments, this.cfg.chunkSize)
      const loaded = await this._uploadSegment(chunk)
      urlSIMPLE = loaded.url
    }

    return {
      name: file.name,
      urlOrig: file.url,
      url: urlSIMPLE,
      size: file.size,
      contentType: file.type
    }
  }

  /**
   * @param {S3ChunkTypedef} chunk 
   */
  _getSegmentUploadUrl(chunk) {
    const { totalSegments, segmentNumber } = chunk
    const { baseUrl, idEtapa } = this.cfg
    const urlParts = [baseUrl + '/uploader/datos_s3', this.idCampo, idEtapa]
    urlParts.push(totalSegments > 1 ? 'multi' : 'single')
    urlParts.push(...[segmentNumber, totalSegments])
    return urlParts.join('/')
  }

  /**
   * @param {BlobFile} file 
   * @param {number} segmentNumber 
   * @param {number} chunkSize 
   * @return {Promise<S3ChunkTypedef>}
   */
  async _getFileSegment(file, segmentNumber, totalSegments, chunkSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const initialPos = chunkSize * (segmentNumber - 1)
      const content = file.slice(initialPos, initialPos + chunkSize)
      const chunk = {
        totalSize: file.size,
        size: content.size,
        segmentNumber,
        filename: file.name,
        totalSegments,
        contentType: file.type
      }
      reader.onload = (evt) => {
        if (evt.target.error) {
          reject(evt.target.error)
        } else {
          chunk.content = evt.target.result
          resolve(chunk)
        }
      }
      reader.readAsArrayBuffer(content);
    })
  }

  _getUploadProgress(segmentNumber, chunkSize, previousUploadedSize, totalSize) {
    const uploaded = (segmentNumber - 1) * chunkSize + previousUploadedSize
    return Math.round((uploaded * 100) / totalSize)
  }

  /**
   * @param {S3ChunkTypedef} chunk 
   */
  async _uploadSegment(chunk) {
    const self = this
    return new Promise((resolve, reject) => {
      var uploadUrl = this._getSegmentUploadUrl(chunk)
      var xhr = new XMLHttpRequest();
      var content = new Uint8Array(chunk.content);

      xhr.addEventListener('load', function (chunkNumber, totalSegments, filename, totalSize) {
        return function (evt) {
          try {
            if (evt.target.status === 200) {
              const uploadStatus = JSON.parse(evt.target.response);
              if (!uploadStatus.success) {
                console.error(`Servidor informa error segmento ${chunkNumber}`, uploadStatus.error);
              } else {
                const uploadedFile = {
                  segmentNumber: chunkNumber,
                  totalSegments,
                  name: filename,
                  url: `${self.cfg.baseUrl}${uploadStatus.URL}`,
                  contentType: chunk.contentType,
                  totalSize
                }
                resolve(uploadedFile)
              }
            } else {
              throw new Error('Error en la carga servidor informa STATUS=' + evt.target.status)
            }
          } catch (e) {
            reject(e)
            return;
          }
        }
      }(chunk.segmentNumber, chunk.totalSegments, chunk.filename, chunk.totalSize));

      xhr.addEventListener("error", function (evt) {
        console.error('Error al enviar', evt);
        reject(evt)
      });

      xhr.addEventListener("abort", function (evt) {
        console.error('Abortado al enviar', evt)
        resolve(null)
      });

      xhr.open("POST", uploadUrl, true);
      xhr.setRequestHeader('X-CSRF-TOKEN', this.cfg.token);
      xhr.setRequestHeader('filename', encodeURI(chunk.filename));
      xhr.setRequestHeader('Content-Type', chunk.contentType);
      xhr.send(content);

    })
  }
}

module.exports = {
  S3_URL_FILE_UPLOADER_DEFAULTS,
  S3UrlFileUploader
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const $ = __webpack_require__(1)
const utils = __webpack_require__(0)
const core = __webpack_require__(2)
const textbox = __webpack_require__(8)
const { S3InputFileUploader } = __webpack_require__(3)


/**
 * Opciones de configuración para componente
 * @typedef {Object} GestorDocumentacionOpcionesTypedef
 * @property {string} propDocumento - como resultado de la carga exitosa del documento se agregará una propiedad 
 * al objeto con este nombre para acceder al dato como elemento[propDocumento]
 * @property {boolean} soloCargados - indica si se entregarán en el listado de salida sólo los datos de los documentos que fueron cargados, 
 * de lo contrario se entregará el mismo listado de entrada completado con los datos de los documentos cargados en el proceso
 * @property {number} tamagnoMaximo - tamano en bytes (binario) como máximo para carga
 * @property {boolean} mostrarChecklist - indica si debe mostrar el listado de checks en caso de contener información
 */


/** @type {GestorDocumentacionOpcionesTypedef} */
const GESTOR_DOCUMENTACION_DEFAULTS = {
  soloCargados: true,
  propDocumento: '_archivo',
  tamagnoMaximo: 5242880,
  mostrarChecklist: true
}

/**
 * Componente para efectuar carga de documentos solicitados a servidor de SIMPLE usando File uploader 
 * de AWS para S3 proveído por API SIMPLE (actúa como proxy de traspaso de contenido a su repositorio
 * final en la nube)
 */
class GestorDocumentacion {
  /**
   * @param {string} targetInput - nombre del campo SIMPLE usado como contenedor del resultado
   * @param {GrupoDocumentacionTypedef[]} groups 
   */
  constructor(targetInput, groups, options) {
    /** @type {GestorDocumentacionOpcionesTypedef} */
    this.cfg = Object.assign({}, GESTOR_DOCUMENTACION_DEFAULTS, options)

    this._$target = textbox.usarInputComoHidden(targetInput)

    this._$wrapper = this._$target.closest('.campo.control-group')
    this._$wrapper.hide()

    const previousState = utils.hidratar(this._$target.val())
    this._grupos = this._mergePreviousState(groups, previousState)
    this._saveState()

    this._uploaders = []
    this.draw()
    this._addValidations()
    this._linkEvents()
    this._saveState()

    this._$wrapper.show()
  }

  /**
   * Reestablece la información anterior del campo asociado dentro de los grupos 
   * acerca de documentos ya cargados asociados a los nuevos datos  
   * @param {GrupoDocumentacionTypedef[]} data - datos agrupados para alimentar el componente
   * @param {GrupoDocumentacionTypedef[]} previousState - datos ya guardados producto de un estado anterior
   */
  _mergePreviousState(data, previousState) {
    if (!previousState) return data;
    data.forEach(g => {
      const _grupo = previousState.find(_g => _g.idGrupo === g.idGrupo)
      if (_grupo) {
        g.documentos.forEach(d => {
          const _doc = _grupo.documentos.find(_d => _d.codigo === d.codigo && _d[this.cfg.propDocumento])
          if (_doc) {
            d[this.cfg.propDocumento] = _doc[this.cfg.propDocumento]
          }
        })
      }
    })
    return data;
  }

  /** identifica si el elemento especificado posee información válida de un documento cargado */
  _hasDocumentAttached(data) {
    return !data[this.cfg.propDocumento] || !data[this.cfg.propDocumento].url || data[this.cfg.propDocumento].url.trim() === ''
  }

  /** identificar filas con documentos requeridos faltantes */
  _markMissingFiles() {
    let hayError = false
    this._grupos.forEach(g => g.documentos.filter(d => d.esObligatorio).forEach(d => {
      const $tr = this._$wrapper.find(`[data-doc=${d.codigo}]`)
      if (this._hasDocumentAttached(d)) {
        $tr.addClass('error')
        hayError = true
      } else {
        $tr.removeClass('error')
      }
    }))
    return hayError
  }

  _isEnabled() {
    return this._$wrapper.attr('data-dependiente-campo') != 'dependiente' && this._$wrapper.is(':visible')
  }
  /** enganchar validaciones del componente en el botón submit */
  _addValidations() {
    const _self = this
    const btn = this._$wrapper.closest('form').find('button[type=submit]')
    $(btn).on('click', (evt) => {
      const mustValidate = _self._isEnabled()
      if (mustValidate) {
        $(this).blur()
        $(this).removeClass('active')
        if (_self._markMissingFiles()) {
          evt.stopPropagation()
          utils.agregarNotificacion('Hay documentos requeridos faltantes, debe proporcionar los documentos marcados para poder continuar.', 'danger')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    })
  }

  draw() {
    const $tg = this._$target
    const $wrapper = $(`<div />`)
    this._grupos.forEach(g => $wrapper.append(this._buildGroupUI(g)));
    $wrapper.insertAfter($tg)
  }

  _setDocumentLoaded($input, archivoCargado) {
    const idGrupo = $input.attr('data-id-grupo')
    const codigoDoc = $input.attr('data-id-doc')
    const grupo = this._grupos.find(g => g.idGrupo === idGrupo)
    const doc = grupo.documentos.find(d => d.codigo.toString() === codigoDoc)
    doc[this.cfg.propDocumento] = archivoCargado
  }

  _linkEvents() {
    const self = this

    // replicar click en inputfile
    $('.upload-documentos').on('click', 'button.upload, button.replace', function (evt) {
      const $tr = $(this).closest('tr')
      $tr.find('label.click-to-upload').click()
    })

    // remover el archivo cargado desde el objeto asociado
    $('.upload-documentos').on('click', 'button.remove', function (evt) {
      const $tr = $(this).closest('tr')
      $tr.removeClass('uploaded')
      const $inputfile = $tr.find('input[type=file]')
      $inputfile.val('')

      self._setDocumentLoaded($inputfile)
      self._saveState()
    })

    // escuchar por el inicio de la carga 
    $('.upload-documentos').on('load-start', 'input[type=file]', function (evt) {
      const $tr = $(this).closest('tr')
      $tr.addClass('uploading')
    })

    // al momento de terminar la carga se entrega la url de descarga
    $('.upload-documentos').on('complete', 'input[type=file]', function (evt, uploadedFile) {
      const $tr = $(this).closest('tr')
      $tr.find('a.link-archivo').attr('href', uploadedFile.url)
        .find('span').text(`${uploadedFile.name} (${uploadedFile.totalSize} bytes)`)
      $tr.removeClass('uploading')
      $tr.removeClass('error')
      $tr.addClass('uploaded')

      self._setDocumentLoaded($(this), uploadedFile)
      self._saveState()
    })

    // para cualquier error en el proceso
    $('.upload-documentos').on('error', 'input[type=file]', function (_evt, err) {
      const $tr = $(this).closest('tr')
      $tr.removeClass('uploading')
      $tr.find('input[type=file]').val('')
      alert(err.message)
    })

    // en la actualización de avance en la carga del archivo al servidor
    $('.upload-documentos').on('progress', 'input[type=file]', function (_evt, data) {
      const $tr = $(this).closest('tr')
      const $progress = $tr.find('div.uploader-bar-progress')
      $progress.width(`${data.totalLoaded}%`)
    })
  }


  /**
   * Serializar datos en campo asociado
   */
  _saveState() {
    const { soloCargados } = this.cfg
    const state = this._grupos.map(g => {
      const ret = utils._clone(g)
      ret.documentos = ret.documentos.filter(d => !soloCargados || d[this.cfg.propDocumento])
      return ret
    }).filter(g => !soloCargados || g.documentos.length)
    this._$target.val(utils.deshidratar(state))
  }

  /**
   * @param {GrupoDocumentacionTypedef} g 
   */
  _buildGroupUI(g) {
    const $wrapper = $(`<div class="upload-documentos"><span class="titulo-grupo">${g.titulo}</span></div>`)
    if (this.cfg.mostrarChecklist) {
      $wrapper.append(this._buildChecklist(g.checklist))
    }
    const $t = $(`<table data-grupo="${g.idGrupo}" />`)

    let docs = g.documentos.filter(d => d.esObligatorio)
    if (docs && docs.length > 0) {
      this._buildDocumentsGroupUI($t, g.idGrupo, 'Listado de documentos Requeridos', docs)
    }

    docs = g.documentos.filter(d => !d.esObligatorio)
    if (docs && docs.length > 0) {
      this._buildDocumentsGroupUI($t, g.idGrupo, 'Listado de documentos Opcionales', docs)
    }
    $wrapper.append($t)
    return $wrapper
  }

  /**
   * Listado de textos para mostrar
   * @param {string[]} textos 
   */
  _buildChecklist(textos) {
    if (textos && textos.length) {
      const $ul = $(`<ul></ul>`)
      textos.forEach(t => $ul.append(`<li class="check"><span class="material-icons">done</span><span>${t}</span></li>`))
      return $(`<div class="resumen"></div`).append($ul)
    } else {
      return null
    }
  }

  /**
   * @param {string} titulo 
   * @param {DocumentoSolicitadoTypedef[]} documentos 
   */
  _buildDocumentsGroupUI($tabla, idGrupo, titulo, documentos) {
    $(`<thead><th colspan="3"><span class="titulo-obligatoriedad">${titulo}</span></th></thead>`).appendTo($tabla)
    const $tbody = $('<tbody />')
    documentos.forEach((d, i) => $tbody.append(this._buildDocumentRowUI(idGrupo, d, i)))
    $tbody.appendTo($tabla)
    return $tabla
  }

  /**
   * @param {DocumentoSolicitadoTypedef} documento
   */
  _buildDocumentRowUI(idGrupo, documento, i) {
    const d = documento
    const arch = d[this.cfg.propDocumento] || {}
    const tamano = arch.size ? `(${arch.size})` : ''
    const idInput = `g${idGrupo}_${d.codigo}_${i}`
    const uploaded = arch.url ? 'uploaded' : ''
    const tpl = `
            <tr data-doc="${d.codigo}" class="hoverable ${uploaded}">
                <td class="estado">
                    <i class="check material-icons">check_circle</i>
                    <i class="error material-icons">report</i>
                </td>
                <td class="documento" title="${d.descripcion ? 'Razón solicitud: ' + d.descripcion : ''}">
                    <span class="nombre">${d.nombre}</span>
                    <span class="desc">${d.descripcion ? d.descripcion : ''}</span>
                    <a class="link-archivo" href="${arch.url || ''}" target="_blank" class="file"><span>${arch.name || ''} ${tamano}</span><i class="material-icons">link</i></a>
                    <div class="uploader-bar"><div class="uploader-bar-progress"></div></div>
                    <label style="display:none;" class="click-to-upload" for="${idInput}">up</label>
                    <input style="display:none;" type="file" id="${idInput}" data-id-grupo="${idGrupo}" data-id-doc="${d.codigo}" />                    
                </td>
                <td class="acciones">
                    <button type="button" class="btn btn-outline-primary remove" title="Remover">
                        <i class="material-icons">delete</i>
                    </button>
                    <button type="button" class="btn btn-outline-primary uploading" title="Cargando">
                        <i class="material-icons spin">loop</i>
                    </button>
                    <button type="button" class="btn btn-primary upload" title="Cargar">
                        <i class="material-icons">cloud_upload</i>
                    </button>
                    <button type="button" class="btn btn-primary replace" title="Reemplazar" >
                        <i class="material-icons">cloud_done</i>
                    </button>
                </td>
            </tr>`
    const $row = $(tpl)
    const $input = $row.find('input[type=file]')
    this._uploaders.push(new S3InputFileUploader(this._$target.attr('id'), $input, { maxSize: this.cfg.tamagnoMaximo }))
    return $row
  }
}


module.exports = {
  GESTOR_DOCUMENTACION_DEFAULTS,
  GestorDocumentacion
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const core = __webpack_require__(2)
const utils = __webpack_require__(0)

/**
* Datos del documento cargado a S3
* @typedef {Object} ArchivoRepositorioTypedef
* @property {string} name - filename
* @property {string} url -  en S3
* @property {string} contentType - content type
*/

/**
 * @typedef {Object} ObservacionExedocTypedef
 * @property {string} texto
 * @property {ArchivoRepositorioTypedef} archivo
 */

/**
* @typedef {Object} DatosExedocTypedef
* @property {number} idTramite
* @property {string} nombreTramite
* @property {string?} codigoCatalogacion - identificador del trámite en la catalogación de trámites RNT (usado tb por PET)
* @property {string} rutSolicitante - 12345678-K
* @property {string} nombreSolicitante
* @property {string} rutResponsable - 12345678-K
* @property {string} nombreResponsable
* @property {number?} tipoDocumentoExedoc - será inferido desde el idTipoServicio o ser especificado desde EXEDOC_CATEGORIA_TRAMITE
* @property {number?} tipoMateriaExedoc - será inferido desde el codigoCatalogacion o ser entregado usando EXEDOC_MATERIA
* @property {number} folio - Folio del servicio
* @property {string} codRegion - '01' ... '13' ... '16'
* @property {number} idTipoServicio - id registrado en RNT
* @property {string[]|string} ppus - arreglo de las ppus involugradas en el trámite
* @property {string} idTransaccion - identificador transacción, por ejemplo idExt de TGR
* @property {number} tipoComprobante - catalogación definida en EXEDOC_TIPO_COMPROBANTE
* @property {string} fechaHoraPago - formato yyyy-MM-dd 
* @property {string} sucursalPago
* @property {number} monto
* @property {ArchivoRepositorioTypedef} archivo - datos caratula resumen
* @property {ObservacionExedocTypedef[]} observaciones - listado de documentos cargados por el solicitante con su respectivo texto a ser desplegado 
*/

/**
 * @typedef {Object} ConfiguracionesExedocTypedef
 * @property {string} prefijoGrupoExedoc - prefijo usado para el grupo de destino en EXEDOC
 * @property {string} emisor 
 * @property {string} documentoAutor
 * @property {string} documentoNombreDestinatario
 * @property {string} nivelUrgencia 
 * @property {string} destinatarioUsuario
 * @property {boolean} destinatarioCopia
 */

/** @type {ConfiguracionesExedocTypedef} */
const CONFIGURACION_EXEDOC_DEFAULTS = {
  prefijoGrupoExedoc: 'RegistroAtiende',
  emisor: 'simple',
  documentoAutor: 'simple',
  documentoNombreDestinatario: "Secretario Regional Ministerial de Transporte y Telecomunicaciones",
  nivelUrgencia: 'normal',
  destinatarioUsuario: 'simple',
  destinatarioCopia: false
}



/** catalogación de trámites */
const EXEDOC_CATEGORIA_TRAMITE = {
  TRANSPORTE_PUBLICO: 91,
  TRANSPORTE_PRIVADO: 92,
  TRANSPORTE_ESCOLAR: 93
}

/**
 * En base al tipo de servicio indicado entrega la catalogación del servicio
 * @param {number} idTipoServicio
 * @returns {number} - el valor de la catalogación desde EXEDOC_CATEGORIA_TRAMITE
 */
function categoriaTramite(idTipoServicio) {
  switch (idTipoServicio) {
    case 4: //  RURAL BUS ESCOLAR 
    case 6: //  URBANO BUS ESCOLAR 
    case 8: //  RURAL MINIBUS ESCOLAR 
    case 10: //  URBANO MINIBUS ESCOLAR 
      return EXEDOC_CATEGORIA_TRAMITE.TRANSPORTE_ESCOLAR
    case 61: //  INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 62: //  RURAL BUS/MINIBUS GENERAL 
    case 63: //  RURAL INTERURBANO BUS/MINIBUS GENERAL 
    case 64: //  RURAL INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 65: //  RURAL TURISMO BUS/MINIBUS GENERAL 
    case 66: //  TURISMO ANFIBIO/EXPEDICION GENERAL 
    case 67: //  TURISMO BUS/MINIBUS GENERAL 
    case 68: //  TURISMO CAMIONETA 4X4 GENERAL 
    case 69: //  TURISMO JEEP 4X4 GENERAL 
    case 70: //  TURISMO LIMUSINA GENERAL 
    case 71: //  TURISMO STATIONWAGON GENERAL 
    case 72: //  URBANO BUS/MINIBUS GENERAL 
    case 73: //  URBANO INTERURBANO BUS/MINIBUS GENERAL 
    case 74: //  URBANO INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 75: //  URBANO INTERURBANO TURISMO LIMUSINA GENERAL 
    case 76: //  URBANO RURAL BUS/MINIBUS GENERAL 
    case 77: //  URBANO RURAL LIMUSINA GENERAL 
    case 78: //  URBANO RURAL INTERURBANO BUS/MINIBUS GENERAL 
    case 79: //  URBANO RURAL INTERURBANO LIMUSINA GENERAL 
    case 80: //  URBANO RURAL INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 81: //  URBANO RURAL INTERURBANO TURISMO LIMUSINA GENERAL 
    case 82: //  URBANO RURAL TURISMO BUS/MINIBUS GENERAL 
    case 83: //  URBANO TURISMO BUS/MINIBUS GENERAL 
    case 101: //  ESCOLAR BUS/MINIBUS ESPECIAL 
    case 121: //  URBANO RURAL TURISMO LIMUSINA GENERAL 
    case 161: //  INTERURBANO BUS/MINIBUS GENERAL 
      return EXEDOC_CATEGORIA_TRAMITE.TRANSPORTE_PRIVADO
    case 2: //  INTERURBANO BUS CORRIENTE 
    case 3: //  RURAL BUS CORRIENTE 
    case 5: //  URBANO BUS CORRIENTE 
    case 7: //  RURAL MINIBUS CORRIENTE 
    case 9: //  URBANO MINIBUS CORRIENTE 
    case 11: //  URBANO BUS EXPRESO 
    case 12: //  URBANO MINIBUS EXPRESO 
    case 13: //  URBANO BUS LOCAL 
    case 14: //  RURAL BUS PERIFÉRICO 
    case 15: //  AEROPUERTO BUS RECORRIDO FIJO 
    case 16: //  AEROPUERTO MINIBUS RECORRIDO FIJO 
    case 17: //  AEROPUERTO BUS RECORRIDO VARIABLE 
    case 18: //  AEROPUERTO MINIBUS RECORRIDO VARIABLE 
    case 19: //  URBANO AUTOMOVIL TAXI BÁSICO 
    case 20: //  INTERURBANO AUTOMOVIL TAXI COLECTIVO 
    case 21: //  RURAL AUTOMOVIL TAXI COLECTIVO 
    case 22: //  URBANO AUTOMOVIL TAXI COLECTIVO 
    case 23: //  URBANO AUTOMOVIL TAXI EJECUTIVO 
    case 24: //  URBANO AUTOMOVIL TAXI TURISMO 
    case 25: //  URBANO BUS TMV 
    case 26: //  URBANO BUS TRANSANTIAGO 
    case 181: //  AUTORIZADO TRAMITE LINEA
      return EXEDOC_CATEGORIA_TRAMITE.TRANSPORTE_PUBLICO

    default: throw new Error(`Tipo de Servicio no catalogado '${idTipoServicio}'`)
  }
}

/** materia referida del trámite en EXEDOC */
const EXEDOC_MATERIA = {
  SIN_MATERIA: 1,
  INSC_SERVICIO: 6,
  INSC_SERVICIO_BUS_MINIBUS_TROLE: 7,
  INSC_VEHICULO_BUS_MINIBUS_TROLE_REEMPLAZO: 8,
  INSC_VEHICULO_BUS_MINIBUS_TROLE_DIRECTA: 9,
  INSC_SERVICIO_BTE: 10,
  INSC_SERVICIO_TAXI_COLECTIVO: 11,
  INSC_VEHICULO_DIRECTA_20474_20867: 12,
  REINSC_VEHICULO_TRASLADO: 13,
  INSC_VEHICULO_RENUEVA_TU_TAXI: 14,
  CERT_VEHICULO_DUPLICADO_INSCRIPCION: 27,
  INSC_SERVICIOS: 36,
  INSC_VEHICULOS: 37,
  INCS_VEHICULO: 59,
}


/**
 * entregar la catalogación de materia en EXEDOC según la catalogación del trámite en RNT de SEGPRES
 * @param {string} idCatalogacion - id proceso (mismo usado como idPET para registro de acciones)
 * @returns {number} el código catalogado en EXEDOC para el trámite
 */
function materiaTramite(idCatalogacion) {
  const codigo = idCatalogacion.toString().padStart(10, '0')
  switch (codigo) {
    case '0100010029': return 2 // Inscripción de servicios de buses, minibuses y trolebuses en el RNSTP
    case '0100010042': return 3 // Inscripción de servicios de taxis colectivos en el RNSTP
    case '0100010030': return 4 // Inscripción de servicios de taxi básico, taxi turismo o taxi ejecutivo en el RNSTP
    case '0100010096': return 5 // Renovación de inscripción de servicios inscritos en el RNSTP
    case '0100010097': return 6 // Modificación de Información del responsable de un servicio inscrito en RNSTP
    case '0100010098': return 7 // Cambio de Domicilio Legal del Responsable de un Servicio inscrito en el RNSTP
    case '0100010025': return 8 // Modificación de representante(s) legal(es) en  servicios inscritos RNSTP
    case '0100010049': return 9 // Inscripción de un bus, trolebús minibús, por ingreso directo o primera inscripción, en un servicio de locomoción colectiva en el RNSTP
    case '0100010093': return 10 // Inscripción de un bus, trolebús minibús, por reemplazo o renovación por chatarrización, en un servicio inscrito en el RNSTP.
    case '0100010005': return 11 // Inscripción de un taxi por reemplazo (general o por Ley o Siniestro) o por Programa Renueva Tu Taxi en el RNSTP
    case '0100010094': return 12 // Inscripción directa de taxis por Ley 20.474/20,867 en el Registro Nacional de Servicios de Transporte de Pasajero.
    case '0100010095': return 13 // Reinscripción de vehículos en un servicio inscrito en el RNSTP, que provienen de un traslado de región o de un traslado de servicio en la misma región.
    case '0100010048': return 14 // Cambio de propietario (transferencia) en vehículos de servicios inscritos en RNSTP
    case '0100010067': return 15 // Incorporación, Eliminación o modificación de conductor inscrito en servicios en el RNSTP.
    case '0100010056': return 16 // Cancelación por traslado de región de un vehículo inscrito en un servicio en el RNSTP
    case '0100010009': return 17 // Cancelación por traslado de servicio dentro de la misma región de un vehículo inscrito en un servicio en el RNSTP.
    case '0100010012': return 18 // Cambio modalidad de un taxi inscrito en un servicio en el RNSTP
    case '0100010003': return 19 // Otras cancelaciones temporales de un vehículo inscrito en un servicio en el RNSTP  (voluntaria, por normas regionales, etc.)
    case '0100010099': return 20 // Cancelaciones definitivas (por reemplazo, antigüedad, etc.) de un vehículo inscrito en un servicio en el RNSTP.
    case '0100010050': return 21 // Cancelación de la inscripción de un servicio inscrito en el RNSTP
    case '0100010007': return 22 // Duplicado de certificado inscripción  y/o Logo (taxis RM) de un vehículo de un servicio inscrito  en el RNSTP    
    case '0100010045': return 23 // Certificación del estado actual de un vehículo o servicio en el RNSTP
    case '0100010044': return 24 // Certificado para obtener revisión técnica de un vehículo inscrito en un servicio del RNSTP o de vehículo entrante en el proceso de reemplazo en la renovación de taxis.
    case '0100010135': return 25 // Listado de Flota de servicios inscritos en el RNSTP
    case '0100010027': return 26 // Cambio o modificación de recorridos, trazados o itinerario con o sin cambio de terminal, en servicios de locomoción colectiva inscritos en el RNSTP.
    case '0100010026': return 27 // Cambio o modificación de horarios de atención por días de semana y/o de las frecuencias en los servicios de locomoción colectiva, inscritos en el RNSTP
    case '0100010043': return 28 // Modificación ubicación oficinas de ventas de pasajes en servicios interurbanos de locomoción colectiva inscritos en el RNSTP
    case '0100010100': return 29 // Informa modificación de tarifas servicios inscritos en el RNSTP
    case '0100010016': return 30 // Inscripción de Servicios en el RENASTRE
    case '0100010137': return 31 // Renovación de inscripción de servicios inscritos en RENASTRE
    case '0100010136': return 32 // Modificación de Información del responsable de un servicio inscrito en el RENASTRE
    case '0100010109': return 34 // Modificación de representante(s) legal(es) en servicios inscritos en el RENASTRE
    case '0100010102': return 35 // Inscripción de vehículos en servicios inscritos en el RENASTRE
    case '0100010117': return 36 // Cambio de propietario (transferencia) en vehículos de servicios inscritos en el RENASTRE
    case '0100010119': return 37 // Cambio en la Capacidad de Asientos en un Vehículo inscrito en el RENASTRE
    case '0100010127': return 38 // Incorporación o Eliminación de conductor inscrito en RENASTRE.
    case '0100010068': return 39 // Incorporación/Eliminación de adulto acompañante en RENASTRE
    case '0100010123': return 40 // Cancelación por traslado de región de un vehículo inscrito en el RENASTRE
    case '0100010105': return 42 // Otras cancelaciones temporales de un vehículo inscrito en el RENASTRE (voluntaria, por normas regionales, etc.)
    case '0100010120': return 44 // Cancelación de la inscripción de un servicio inscrito en el RENASTRE
    case '0100010107': return 45 // Duplicado de certificado inscripción de un vehículo de un servicio inscrito en el RENASTRE.    
    case '0100010113': return 46 // Certificación del estado actual de un vehículo o servicio en el RENASTRE
    case '0100010111': return 47 // Certificado para obtener revisión técnica de un vehículo inscrito o a inscribir en un servicio en el RENASTRE.
    case '0100010134': return 48 // Listado de Flota de servicios inscritos en el RENASTRE
    case '0100010023': return 49 // Inscripción de Servicios de TTEPRIV (Autorización General).
    case '0100010122': return 50 // Inscripción de Servicios de TTEPRIV con vehículos inscritos en RENASTRE (Autorización Especial)
    case '0100010126': return 52 // Modificación de Información del responsable de un servicio inscrito como TTEPRIV
    case '0100010130': return 53 // Cambio de Domicilio Legal del Responsable de un Servicio inscrito como TTEPRIV
    case '0100010110': return 54 // Modificación de representante(s) legal(es) en servicios inscritos como TTEPRIV
    case '0100010125': return 55 // Inscripción de vehículo en un servicio inscrito como TTEPRIV
    case '0100010118': return 56 // Cambio de propietario (transferencia) en vehículos de servicios inscritos como TTEPRIV
    case '0100010131': return 57 // Modificación a la Capacidad de Asientos en un Vehículo Que Presta Servicio de TTEPRIV (Autorización General).
    case '0100010128': return 58 // Incorporación o Eliminación de conductor en servicios inscritos como TTEPRIV
    case '0100010124': return 59 // Cancelación por traslado de región de un vehículo inscrito como TTEPRIV (Autorización General)
    case '0100010138': return 60 // Cancelación por traslado de servicio dentro de la misma región de un vehículo inscrito como TTEPRIV  (Autorización General)
    case '0100010106': return 61 // Otras cancelaciones temporales de un vehículo inscrito como TTEPRIV  (Autorización General) (voluntaria, por normas regionales, etc.)
    case '0100010139': return 62 // Cancelaciones definitivas de un vehículo inscrito como TTEPRIV  (Autorización General)
    case '0100010140': return 63 // Cancelación de un vehículo inscrito en TTEPRIV (Autorización Especial)
    case '0100010121': return 64 // Cancelación de la inscripción de un servicio inscrito en TTEPRIV
    case '0100010108': return 65 // Duplicado de constancia de autorización de un vehículo de un servicio inscrito como TTEPRIV.
    case '0100010114': return 66 // Certificación del estado actual de un vehículo o servicio en TTEPRIV
    case '0100010112': return 67 // Certificado para obtener revisión técnica de un vehículo inscrito o por inscribir en TTEPRIV (Autorización General)
    default:
      console.warn(`no se identifica catalogación para proceso '${codigo}' (${idCatalogacion}) `)
      return 0
  }
}



/** tipo de comprobante del pago catalogado  */
const EXEDOC_TIPO_COMPROBANTE = {
  DEPOSITO_EFECTIVO: 1,
  DEPOSITO_DOCUMENTOS: 2,
  TRANSFERENCIA: 3,
  BOTON_DE_PAGO: 4
}

/**
 * Entrega la codificación de Tipo de Servicio asociado al trámite electrónico usando el id de Tipo de Servicio registrado en RNT
 * @param {number} idTipoServicio - Id del tipo servicio en RNT
 * @returns {number} - código de servicio registrado en EXEDOC
 */
function tipoServicioExedoc(idTipoServicio) {
  switch (idTipoServicio) {
    case 1: return 6 //  INTERNACIONAL BUS CORRIENTE 
    case 2: return 9 //  INTERURBANO BUS CORRIENTE 
    case 3: return 13 //  RURAL BUS CORRIENTE 
    case 4: return 14 //  RURAL BUS ESCOLAR 
    case 5: return 32 //  URBANO BUS CORRIENTE 
    case 6: return 33 //  URBANO BUS ESCOLAR 
    case 7: return 17 //  RURAL MINIBUS CORRIENTE 
    case 8: return 18 //  RURAL MINIBUS ESCOLAR 
    case 9: return 39 //  URBANO MINIBUS CORRIENTE 
    case 10: return 40 //  URBANO MINIBUS ESCOLAR 
    case 11: return 34 //  URBANO BUS EXPRESO 
    case 12: return 41 //  URBANO MINIBUS EXPRESO 
    case 13: return 35 //  URBANO BUS LOCAL 
    case 14: return 15 //  RURAL BUS PERIFÉRICO 
    case 15: return 1 //  AEROPUERTO BUS RECORRIDO FIJO 
    case 16: return 3 //  AEROPUERTO MINIBUS RECORRIDO FIJO 
    case 17: return 2 //  AEROPUERTO BUS RECORRIDO VARIABLE 
    case 18: return 4 //  AEROPUERTO MINIBUS RECORRIDO VARIABLE 
    case 19: return 28 //  URBANO AUTOMOVIL TAXI BÁSICO 
    case 20: return 8 //  INTERURBANO AUTOMOVIL TAXI COLECTIVO 
    case 21: return 12 //  RURAL AUTOMOVIL TAXI COLECTIVO 
    case 22: return 29 //  URBANO AUTOMOVIL TAXI COLECTIVO 
    case 23: return 30 //  URBANO AUTOMOVIL TAXI EJECUTIVO 
    case 24: return 31 //  URBANO AUTOMOVIL TAXI TURISMO 
    case 25: return 36 //  URBANO BUS TMV 
    case 26: return 37 //  URBANO BUS TRANSANTIAGO 
    case 61: return 11 //  INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 62: return 16 //  RURAL BUS/MINIBUS GENERAL 
    case 63: return 19 //  RURAL INTERURBANO BUS/MINIBUS GENERAL 
    case 64: return 20 //  RURAL INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 65: return 21 //  RURAL TURISMO BUS/MINIBUS GENERAL 
    case 66: return 22 //  TURISMO ANFIBIO/EXPEDICION GENERAL 
    case 67: return 23 //  TURISMO BUS/MINIBUS GENERAL 
    case 68: return 24 //  TURISMO CAMIONETA 4X4 GENERAL 
    case 69: return 25 //  TURISMO JEEP 4X4 GENERAL 
    case 70: return 26 //  TURISMO LIMUSINA GENERAL 
    case 71: return 27 //  TURISMO STATIONWAGON GENERAL 
    case 72: return 38 //  URBANO BUS/MINIBUS GENERAL 
    case 73: return 42 //  URBANO INTERURBANO BUS/MINIBUS GENERAL 
    case 74: return 43 //  URBANO INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 75: return 44 //  URBANO INTERURBANO TURISMO LIMUSINA GENERAL 
    case 76: return 45 //  URBANO RURAL BUS/MINIBUS GENERAL 
    case 77: return 46 //  URBANO RURAL LIMUSINA GENERAL 
    case 78: return 47 //  URBANO RURAL INTERURBANO BUS/MINIBUS GENERAL 
    case 79: return 48 //  URBANO RURAL INTERURBANO LIMUSINA GENERAL 
    case 80: return 49 //  URBANO RURAL INTERURBANO TURISMO BUS/MINIBUS GENERAL 
    case 81: return 50 //  URBANO RURAL INTERURBANO TURISMO LIMUSINA GENERAL 
    case 82: return 51 //  URBANO RURAL TURISMO BUS/MINIBUS GENERAL 
    case 83: return 53 //  URBANO TURISMO BUS/MINIBUS GENERAL 
    case 101: return 5 //  ESCOLAR BUS/MINIBUS ESPECIAL 
    case 121: return 52 //  URBANO RURAL TURISMO LIMUSINA GENERAL 
    case 141: return 7 //  INTERNACIONAL CAMION/VEH.APOYO CORRIENTE 
    case 161: return 10 //  INTERURBANO BUS/MINIBUS GENERAL 

    default:
      console.warn(`no se registra un código de servicio asociado al tipo de servicio ${idTipoServicio}`)
      return 0
  }
}

/**
 * Convierte el listado de observaciones al formato json de EXEDOC
 * @param {ObservacionExedocTypedef[]} obs 
 */
function mapObservaciones(obs) {
  return obs ? obs.map(o => ({
    texto: o.texto,
    archivo: o.archivo ? {
      nombreArchivo: o.archivo.name,
      contentType: o.archivo.contentType,
      data: o.archivo.url
    } : null,
    adjuntadoPor: "simple"
  })) : []
}


/**
 * @param {DatosExedocTypedef} datos 
 * @param {ConfiguracionesExedocTypedef} opciones
 */
function crearObjetoExedoc(datos, opciones) {
  try {
    const fechaActual = new Date()
    var objExe = {
      "emisor": opciones.emisor,
      "idSimple": datos.idTramite,
      "identificadorServicio": (datos.folio || "s/n").toString(),
      "idRegion": datos.codRegion,
      "idTipoServicio": tipoServicioExedoc(datos.idTipoServicio),
      "ppu": Array.isArray(datos.ppus) ? datos.ppus.join(';') : datos.ppus,
      "rutResponsable": datos.rutResponsable,
      "rutSolicitante": datos.rutSolicitante,
      "nombreSolicitante": datos.nombreSolicitante,
      "idTransaccion": datos.idTransaccion,
      "monto": datos.monto || 0,
      "tipoComprobante": datos.tipoComprobante || 0,
      "fechaHoraPago": datos.fechaHoraPago || '',
      "sucursalPago": datos.sucursalPago || '',
      "urlCallbackSimple": `${window.location.protocol}//${window.location.host}/backend/api/notificar/${datos.idTramite}`,
      "documento": {
        "numero": "s/n",
        "fecha": utils.toStrDatetime(fechaActual),
        "autor": opciones.documentoAutor,
        "tipoDocumento": datos.tipoDocumentoExedoc || categoriaTramite(datos.idTipoServicio),
        "tipoMateria": datos.tipoMateriaExedoc || materiaTramite(datos.codigoCatalogacion),
        "reservado": false,
        "antecedentes": "s/a",
        "materia": datos.nombreTramite,
        "nivelUrgencia": datos.nivelUrgencia,
        "emisor": datos.nombreResponsable,
        "destinatario": [opciones.documentoNombreDestinatario],
        "dataArchivo": datos.archivo.url,
        "nombreArchivo": datos.archivo.name,
        "contentType": datos.archivo.contentType
      },
      "destinatario": [{ "usuario": opciones.destinatarioUsuario, "copia": opciones.destinatarioCopia.toString() }],
      "destinatarioGrupo": [
        `${opciones.prefijoGrupoExedoc}${parseInt(datos.codRegion, 10)}`
      ],
      "observacion": mapObservaciones(datos.observaciones)
    }

    return objExe
  } catch (error) {
    return { error: "Error al crear json exedoc: " + error.message, stacktrace: error.stackTrace }
  }
}


/** 
 * Uso del campo indicado como destino del objeto deshidratado para enviar a EXEDOC 
 * @param {string} nombreCampo - nombre del campo en formulario simple
 * @param {DatosExedocTypedef} datos 
 * @param {ConfiguracionesExedocTypedef} opciones
 */
function definirCampoJsonExedoc(nombreCampo, datos, opciones) {
  const opts = Object.assign({}, CONFIGURACION_EXEDOC_DEFAULTS, opciones || {})
  const $t = core.usarInputComoHidden(nombreCampo)
  const objExedoc = crearObjetoExedoc(datos, opts)
  console.debug('definirCampoJsonExedoc', objExedoc)
  $t.val(utils.deshidratar(objExedoc))
}



module.exports = {
  EXEDOC_CATEGORIA_TRAMITE,
  EXEDOC_MATERIA,
  EXEDOC_TIPO_COMPROBANTE,

  definirCampoJsonExedoc,
  tipoServicioExedoc,
  categoriaTramite,
  materiaTramite
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const core = __webpack_require__(2)
const utils = __webpack_require__(0)

/**
 * Datos requeridos desde formulario para construir la información del pago
 * @typedef {Object} DatosPagoTGRTypedef
 * @property {string} rut - RUT asociado al solicitante 
 * @property {string} razonSocial  - nombre o razon social asociada al rut
 * @property {number} idTramite - id trámite actual
 * @property {string} tramite  - nombre del proceso
 * @property {number} monto  - monto a pagar
 * @property {string} descripcion - contenido adicional
 */

/**
 * @param {DatosPagoTGRTypedef} datosPago 
 */
function crearObjetoPago(datosPago) {
  const fechaVencimiento = new Date(Date.now() + (1 * 86400000))
  const r = datosPago.rut.split('-')
  var objPago = {
    "rut": r[0],
    "dv": r[1],
    "descripcion": (datosPago.descripcion || `Trámite ${datosPago.idTramite}`).substr(0, 30),
    "razonSocial": datosPago.razonSocial.substr(0, 200),
    "vencimiento": utils.toStrDate(fechaVencimiento),
    "monto": datosPago.monto,
    "nombreTramite": datosPago.tramite.substr(0, 100),
    "urlCallbackSimple": `${window.location.protocol}//${window.location.host}/backend/api/notificar/${datosPago.idTramite}`
  }
  return objPago
}


/**
  * @param {string} nombreCampo - nombre del campo conteniendo el valor
  * @param {DatosPagoTGRTypedef} datosPago - datos del pago a efectuar
  */
function definirCampoJsonPago(nombreCampo, datosPago) {
  const $t = core.usarInputComoHidden(nombreCampo)
  const objPago = crearObjetoPago(datosPago)
  $t.val(utils.deshidratar(objPago))
}

module.exports = {
  definirCampoJsonPago
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const core = __webpack_require__(2)
const utils = __webpack_require__(0)

/**
 * @typedef {Object} DatosPETTypedef
 * @property {string} idTramite - id trámite SIMPLE
 * @property {string} idProceso - id proceso en PET
 * @property {string} region - código de la región del servicio
 * @property {string} rutResponsable
 * @property {string} rutSolicitante
 * @property {string} runMandatario
 * @property {string} nombreProceso - glosa del trámite en SIMPLE
 * @property {string} formaActua 
 * @property {string} estadoSolicitud 
 */

/**
 * definir el campo asociado al valor de registro para PET
 * @param {string} nombreCampo 
 * @param {DatosPETTypedef} datos 
 */
function definirCampoJsonPET(nombreCampo, datos) {
  const $t = core.usarInputComoHidden(nombreCampo)
  const d = Object.assign({ "estado_de_la_solicitud": datos.estadoSolicitud }, datos)
  delete d.estadoSolicitud
  $t.val(utils.deshidratar(d))
}

module.exports = {
  definirCampoJsonPET
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(0)

/**
 * @typedef {Object} DatosTramiteGATypedef
 * @property {string} paginaTitulo - titulo personalizado
 */

/**
 * @param {string} codigoGA - código de la propiedad
 * @param {DatosTramiteGATypedef} datosGA - datos anexos para complementar tracking
 * @param {string} globalName - nombre de la function google analitics retornada ('gtag')
 */
function gaInit(codigoGA, datosGA, globalName = 'gtag') {
  const _d = datosGA || {}
  const gtag = function () { dataLayer.push(arguments); }
  window.dataLayer = window.dataLayer || []

  utils.cargarRecurso(`https://www.googletagmanager.com/gtag/js?id=${codigoGA}`, 'js').catch(err => console.log('carga de recurso', err))

  gtag('js', new Date())
  gtag('config', codigoGA, { 'send_page_view': false })
  gtag('config', codigoGA, { 'page_title': _d.paginaTitulo || document.title })


  // gtag('config', codigoGA, { 'page_title': 'titulo personalizado page_title', 'page_location': gaLocation(idTramite) })

  window[globalName] = gtag
  return gtag
}


module.exports = {
  gaInit
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4)
// require('datatables.net')

/**
 * @typedef {Object} GrillaDatosExternosOpsTypedef
 * @property {boolean} hidePaginacion - visibilidad de la paginación
 * @property {boolean} hideFiltro - visibilidad del buscador superior  
 * @property {boolean} hideLargo
 * @property {boolean} hideInformacion
 * @property {number} paginaLargo - cantidad de elementos por página
 */

/**
 * @typedef {Object} DatosGrillaConductoresTypedef
 * @property {string} ppu
 * @property {string} rut
 * @property {string} email
 * @property {string} telefono
 */

/**
 * entrega de forma estática la estrcutura para cargar en el Gestor de documentos asociado a documentos
 * de Representante Legal
 * @returns {GrupoDocumentacionTypedef[]}
 */
function documentosRepresentante() {
  return [
    {
      idGrupo: 'representante',
      titulo: 'Documentación asociada Representante Legal',
      documentos: [
        {
          nombre: 'Certificado de Vigencia de Representatividad con vigencia no mayor a 30 días',
          codigo: 'V01',
          descripcion: '',
          esObligatorio: true
        },
        {
          nombre: 'Copia Rol Único Tributario de la Persona Jurídica',
          codigo: 'V02',
          descripcion: '',
          esObligatorio: true
        }
      ]
    }
  ]
}


/**
 * @param {ConductoresPorVehiculosPpuTypedef[]} ppus
 * @returns {DatosGrillaConductoresTypedef[]}
 */
function datosPrecargaTabla(ppus) {
  // _acciones_ debe ser agregado por la modificacion particular de SIMPLE sobre la tabla
  return ppus.map(p => ({ ppu: p.ppu, rut: '', telefono: '', email: '', "_acciones_": '' }))
}


function getIdCampo(nombreCampo) {
  const $c = $(`[name=${nombreCampo}]`).first()
  const $w = $c.closest('.campo.control-group')
  return parseInt($w.attr('data-id') || '0', 10)
}


function modificaClase(w, ocultar, clase) {
  if (ocultar) {
    $(w).addClass(clase)
  } else {
    $(w).removeClass(clase)
  }
}

/**
 * Modificar el aspecto visual o de funcionamiento de la grilla de datos externos
 * @param {string} nombreCampo 
 * @param {GrillaDatosExternosOpsTypedef} opciones 
 */
function grillaExternaModifcar(nombreCampo, opciones) {
  const idCampo = getIdCampo(nombreCampo)
  // https://datatables.net/manual/options
  const grilla = $('#grilla-' + idCampo).DataTable()
  if (!opciones) {
    return grilla
  }


  grilla.page.info
  grilla.page.len(opciones.paginaLargo || 50)
  grilla.draw()

  // por ahora algunas opciones que no son posibles de modificar por API y necesitan 
  // recrear la tabla, lo que puede causar problemas
  const $w = $(`.campo.control-group[data-id=${idCampo}] .controls.grid-Cls`)
  modificaClase($w, opciones.hideFiltro, 'grilla_hide_filter')
  modificaClase($w, opciones.hidePaginacion, 'grilla_hide_paginate')
  modificaClase($w, opciones.hideInformacion, 'grila_hide_info')
  modificaClase($w, opciones.hideLargo, 'grila_hide_length')

  return grilla
}

/**
 * Define datos iniciales para la grilla en caso de que no contenga información. 
 * Los datos tienen la estructura definida en la configuración de la grilla
 * @param {any[]} datos 
 * @param {string} nombreCampo
 * @param {GrillaDatosExternosOpsTypedef} opciones
 */
function grillaExternaDatosIniciales(nombreCampo, datos, opciones) {
  const idCampo = getIdCampo(nombreCampo)
  const grilla = grillas_datatable[idCampo]

  const dataTable = grillaExternaModifcar(nombreCampo, opciones)
  console.log(dataTable.count())

  if (!grilla.data || !grilla.data.length) {
    if (grilla.is_array) {
      grilla_populate_array(idCampo, datos);
    } else {
      grilla_populate_objects(idCampo, datos);
    }
    store_data_in_hidden(idCampo)
    grilla.table.draw(true);
    grilla.table.columns.adjust();
  }

  return dataTable
}

module.exports = {
  documentosRepresentante,
  datosPrecargaTabla,
  grillaExternaDatosIniciales
}

/***/ })
/******/ ]);