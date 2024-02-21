import { Feature } from "geojson";
import L, { LatLng, Layer } from "leaflet";
import { ModalComponent } from "../components/modal/modal.component";
import { HtmlUtil } from "./html.utils";

export class FeatureUtils {

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
        if (!feature.properties) return;

        const area = feature.properties['areaMapeamento'];
        const numPhotos = feature.properties['quantidadeFoto'];
        const codEstab = feature.properties['codigoEstabelecimento'];
        const pathPhoto = feature.properties['caminhoFoto'];
        const estabelecimento = feature.properties['estabelecimento'];
        const municipio = feature.properties['municipio'];

        const content = document.createElement('div');
        content.innerHTML = FeatureUtils.basicInfoInvestHtml(pathPhoto, numPhotos, estabelecimento, municipio);

        const modal = ModalComponent.modalInfo(feature, area, codEstab);

        HtmlUtil.moveElement(modal, content);

        layer.bindPopup(content).on('popupopen', () => {
            const button = content.querySelector('.btn-link');
            if (button) {
                button.addEventListener('click', () => {
                    ModalComponent.showModal(`${area}_${codEstab}_informacao`, true, numPhotos);
                    HtmlUtil.moveElement(modal, "container-modal");
                });
            }
        });
    }

    public static basicInfoInvestHtml(pathPhoto: string, numPhotos: number, estabelecimento: string, municipio: string): string {
        let html = '';

        if (numPhotos > 0) {
            html += `<img src="${pathPhoto}/foto_0.jpg" class="img-popup">`;
        }
        html += '<p><strong> Estabelecimento: ' + estabelecimento + '</strong></p>';
        html += '<p><strong> Município: ' + municipio + '</strong></p>';

        html += '<button class="btn-link"><a>Mais informações</a></button>';

        return html;
    }
}