import { Feature } from "geojson";
import L, { LatLng, Layer } from "leaflet";
import { FormatNumber } from "./format.number.utils";
import { ModalComponent } from "../components/modal/modal.component";

export class FeatureUtils {
    modal: ModalComponent = new ModalComponent();

    public static setCustomMark(feature: Feature, latLng: LatLng): L.Marker {
        const BASE_CAMINHO_IMAGEM = 'assets/icones_novos';
        const nameIcon = FeatureUtils.getIconPath(feature, BASE_CAMINHO_IMAGEM);
        const myIcon = L.icon({
            iconUrl: nameIcon,
            iconSize: [35, 35],
            shadowSize: [35, 20],
            iconAnchor: [12, 12],
            shadowAnchor: [12, 6],
            popupAnchor: [0, 0]
        });

        return L.marker(latLng, { icon: myIcon });
    }

    public static getIconPath(feature: Feature, basePath: string): string {
        if (!feature.properties)
            return "";

        const categoriaPath: Record<string, string> = {
            'ABASTECIMENTO DE ÁGUA': '/Abastecimento de água.svg',
            'APICULTURA': '/Apicultura (1).svg',
            'AQUICULTURA E PESCA': '/AQUICULTURA E PESCA.svg',
            'ARTESANATO E CONFECCÇÃO': '/ARTESANATO.svg',
            'AVICULTURA': '/avicultura 1.svg',
            'BANDAS FILARMÔNICAS': '/Banda.svg',
            'BARRAGEM': '/Barragem.svg',
            'CENTRO DE COMERCIALIZAÇÃO': '/Unidade de comercializacao.svg',
            'CENTRO DE FORMAÇÃO': '/Centro de formação.svg',
            'CENTRO DE MANEJO ': '/Centros de manejo.svg',
            'COMERCIALIZAÇÃO': '/comercializacao 1.svg',
            'DIBA': '/RECUPERAÇÃO ESTRUTURAL DO DIBA.svg',
            'EQUIPAMENTO CULTURAL': '/Cultura.svg',
            'ESGOTAMENTO SANITÁRIO': '/esgotamento sanitário.svg',
            'IMPLANTAÇÃO DE RODOVIA': '/INFRAESTRUTURA.svg',
            'RECUPERAÇÃO DE RODOVIA': '/INFRAESTRUTURA.svg',
            'FRUTICULTURA': '/FRUTICULTURA_1.svg',
            'GALPÃO PARA ARMAZENAMENTO': '/Galpão de armazenamento.svg',
            'LEGUMINOSA': '/Leguminosa.svg',
            'LEITE E DERIVADOS': '/Leite e derivados.svg',
            'MANDIOCULTURA': '/mandioca 1.svg',
            'OBRAS HIDROAMBIENTAIS': '/Obras hidroambientais.svg',
            'PARQUE TECNOLÓGICO': '/Parque tecnológico.svg',
            'PRODUÇÃO DE ALIMENTOS': '/ALIMENTOS.svg',
            'QUEIJEIRA': '/Leite e derivados.svg',
            'RECICLAGEM': '/reciclagem 1.svg',
            'RECUPERAÇÃO DE ÁREAS DEGRADADAS': '/Combate a desertificação.svg',
            'SISTEMAS SIMPLIFICADO DE ABASTECIMENTO DE ÁGUA': '/Sistema de abastecimento de água.svg',
            'IMPLANTAÇÃO DE ESCOLA': '/Escola.svg',
            'AMPLIAÇÃO/REFORMA DE ESCOLA': '/Escola.svg',
            'PROJETO DE INOVAÇÃO PEDAGÓGICA (PIP)': '/Projeto de inovação pedagógica (pip).svg',
            'CENTRAL DO CIDADÃO': '/central do cidadao.svg',
            'CENTRO ADMINISTRATIVO': '/Centro administrativo.svg',
            'POSTO INTEGRADO DE FISCALIZAÇÃO': '/POSTO DE FISCALIZAÇÃO.svg',
            'SINE': '/Sine.svg',
            'ENFRENTAMENTO DA COVID-19': '/Enfrentamento da covid-19.svg',
            'HOSPITAL DA MULHER': '/hospital regional.svg',
            'HOSPITAL REGIONAL ': '/hospital regional.svg',
            'LABORATÓRIO DE ANATOMOCITOPATOLOGIA': '/Laboratório.svg',
            'MATERNIDADES': '/hospital regional.svg',
            'REDE METROPOLITANA DE DADOS': '/Rede metropolitana de dados.svg',
            'default': '/Irrigacao.svg',
        };

        const categoria = String(feature.properties['categoriaMapeamento']);
        const nameIcon = basePath + (categoriaPath[categoria] || categoriaPath['default']);
        return nameIcon;
    }

    public static customBindPopup(feature: Feature, layer: Layer): void {
        if(!feature.properties)
            return;

        const area = feature.properties['areaMapeamento'];
        const numPhotos = feature.properties['quantidadeFoto'];
        const codEstab = feature.properties['codigoEstabelecimento'];
        const pathPhoto = feature.properties['caminhoFoto'];
        const estabelecimento = feature.properties['estabelecimento'];
        const municipio = feature.properties['municipio'];

        let html = FeatureUtils.basicInfoInvestHtml(pathPhoto, numPhotos, estabelecimento, municipio);
        let modal = document.querySelector<HTMLElement>(".container-modal");

        html += `<button class="btn-link" onclick="modal.showModal('${area}_${codEstab}_informacao',true,${numPhotos})"><a>Mais informações</a> </button></div>`
        modal!.innerHTML = FeatureUtils.modalInfo(feature, estabelecimento, codEstab);
        layer.bindPopup(html);
    }

    public static basicInfoInvestHtml(pathPhoto: string, numPhotos: number, estabelecimento: string, municipio: string): string {
        let html = '';

        if (numPhotos > 0) {
            html += `<img src="${pathPhoto}/foto_0.jpg" class="img-popup">`;
        }

        html += '<p><strong> Estabelecimento: ' + estabelecimento + '</strong></p>';
        html += '<p><strong> Município: ' + municipio + '</strong></p>';

        return html
    }

    public static modalInfo(feature: Feature, estabelecimento: string, codEstab: number): string {
        if (!feature.properties)
            return "";

        let html = `<div class="informacao" id='${estabelecimento}_${codEstab}_informacao' style='display:none'>`
        html += '<p><strong> Estabelecimento </strong></p> <p>' + feature.properties['estabelecimento'] + '</p> <br>'
        html += '<p><strong> Orgão </strong></p> <p>' + feature.properties['orgao'] + '</p> <br>'
        html += '<p><strong> Município </strong></p> <p>' + feature.properties['municipio'] + '</p> <br>'
        html += '<p><strong> Território </strong></p> <p>' + feature.properties['territorio'] + '</p> <br>'
        html += '<p><strong> Área </strong></p> <p>' + feature.properties["areaMapeamento"] + '</p> <br>'

        if (feature.properties["somatorioBens"] != 0)
            html += '<p><strong> Total Investimento bens </strong></p> <p>R$ ' + FormatNumber.formatIntegerNumber(feature.properties["somatorioBens"]) + '</p> <br>';
        if (feature.properties["somatorioObras"] != 0)
            html += '<p><strong> Total Investimento obras </strong></p> <p>R$ ' + FormatNumber.formatIntegerNumber(feature.properties["somatorioObras"]) + '</p> <br>';
        if (feature.properties["somatorioSubprojetos"] != 0)
            html += '<p><strong> Total Investimento subprojetos </strong></p> <p>R$ ' + FormatNumber.formatIntegerNumber(feature.properties["somatorioSubprojetos"]) + '</p>';
        html += '<div class="close-icon-info"><i (click)="ModalComponent.closeModal(ver_informacoes = true)" class="fa-solid fa-x"></i></div>'
        html += '</div>'

        return html
    }
}