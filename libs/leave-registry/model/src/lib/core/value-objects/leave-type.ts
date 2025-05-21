import { CountryCode } from '@payfit/common-time-model'

export const LEAVE_TYPES_MANAGED_BY_NEW_WRITE_MODEL = ['fr_conges_payes']

export type FranceLeaveType =
  | 'fr_conges_payes'
  | 'fr_rtt'
  | 'fr_repos'
  | 'fr_absence_remuneree'
  | 'fr_sans_solde'
  | 'fr_absence_injustifiee'
  | 'fr_mise_a_pied'
  | 'fr_maladie_ordinaire'
  | 'fr_accident_travail'
  | 'fr_accident_trajet'
  | 'fr_maladie_professionnelle'
  | 'fr_temps_partiel_therapeutique'
  | 'fr_paternite'
  | 'fr_maternite'
  | 'fr_second_parent'
  | 'fr_pathologique'
  | 'fr_naissance'
  | 'fr_adoption'
  | 'fr_echographie_prenatale'
  | 'fr_interruption_spontanee_grossesse'
  | 'fr_examen_assistance_medicale_procreation'
  | 'fr_enfant_malade'
  | 'fr_hospitalisation_enfant'
  | 'fr_parental_education'
  | 'fr_handicap_enfant'
  | 'fr_handicap_conjoint'
  | 'fr_demarches_handicap'
  | 'fr_conjoint_malade_ou_hospitalise'
  | 'fr_mariage_salarie'
  | 'fr_pacs_salarie'
  | 'fr_mariage_enfant'
  | 'fr_mariage_frere_ou_soeur'
  | 'fr_mariage_beau_frere_ou_belle_soeur'
  | 'fr_mariage_ascendant'
  | 'fr_mariage_petit_enfant'
  | 'fr_mariage_beau_parent'
  | 'fr_deces_beau_pere_ou_belle_mere'
  | 'fr_deces_conjoint'
  | 'fr_deces_enfant'
  | 'fr_deces_frere_ou_soeur'
  | 'fr_deces_grand_parent'
  | 'fr_deces_pere_ou_mere'
  | 'fr_deces_beau_frere_ou_belle_soeur'
  | 'fr_deces_gendre_ou_belle_fille'
  | 'fr_deces_petit_enfant'
  | 'fr_deces_oncle'
  | 'fr_deces_arriere_grand_parent'
  | 'fr_deuil'
  | 'fr_activite_partielle'
  | 'fr_appel_preparation_defense'
  | 'fr_rentree'
  | 'fr_revision'
  | 'fr_examen_professionnel_formation_continue'
  | 'fr_demenagement'
  | 'fr_demenagement_mutation'
  | 'fr_mobile'
  | 'fr_ceremonie_enfant_communion_solennelle'
  | 'fr_tutelle'
  | 'fr_teletravail'
  | 'fr_ecole'

export type SpainLeaveType =
  | 'es_ausencia_no_remunerada'
  | 'es_ausencia_no_remunerada_no_justificada'
  | 'es_ausencia_no_remunerada'
  | 'es_licencia_sin_sueldo'
  | 'es_huelga'
  | 'es_permiso_por_convenio_no_remunerado'
  | 'es_permiso_parental'
  | 'es_permiso_no_retribuido'
  | 'es_vacaciones'
  | 'es_teletrabajo'
  | 'es_descanso_horas_extras'
  | 'es_descanso_por_festivo_trabajado'
  | 'es_tiempo_de_descanso'
  | 'es_visita_medica'
  | 'es_visita_medica_familiar'
  | 'es_permiso_por_matrimonio'
  | 'es_deber_inexcusable'
  | 'es_examenes_prenatales'
  | 'es_tecnicas_de_preparacion_al_parto'
  | 'es_adopcion'
  | 'es_mudanza'
  | 'es_permiso_por_examenes'
  | 'es_permiso_por_formacion'
  | 'es_asuntos_propios'
  | 'es_jornada_de_licencia'
  | 'es_lactancia_acumulada'
  | 'es_prematuros_hospitalizados'
  | 'es_permiso_especial_fuerza_mayor'
  | 'es_otro_asunto_personal'
  | 'es_fallecimiento_pariente_de_primer_grado_de_consanguinidad'
  | 'es_fallecimiento_pariente_de_segundo_grado_de_consanguinidad'
  | 'es_hospitalizacion_de_un_familiar'
  | 'es_intervencion_quirurgica_sin_hospitalizacion'
  | 'es_accidente_o_enfermedad_grave'
  | 'es_permiso_asistencia_a_matrimonio'
  | 'es_fallecimiento_pariente_de_tercer_grado_de_consanguinidad'
  | 'es_fallecimiento_conyuge_o_descendientes'
  | 'es_otro_asunto_familiar'
  | 'es_permiso_por_horas'
  | 'es_enfermedad_comun'
  | 'es_accidente_no_laboral'
  | 'es_accidente_de_trabajo'
  | 'es_suspension_de_empleo_y_sueldo'
  | 'es_maternidad'
  | 'es_paternidad'
  | 'es_incapacidad_temporal_sin_prestacion'
  | 'es_riesgo_en_el_embarazo'
  | 'es_menstruacion'
  | 'es_proteccion_de_la_salud_reproductiva'

export type GreatBritainLeaveType =
  | 'uk_annual_leave'
  | 'uk_remote'
  | 'uk_maternity'
  | 'uk_paternity'
  | 'uk_kit'
  | 'uk_adoption'
  | 'uk_sick_leave'
  | 'uk_covid'
  | 'uk_paid_leave'
  | 'uk_jury_service'
  | 'uk_unpaid_leave'
  | 'uk_compassionate_leave'
  | 'uk_bereavement_leave'

export type GlobalLeaveType =
  | FranceLeaveType
  | SpainLeaveType
  | GreatBritainLeaveType

export type LeaveType = {
  name: GlobalLeaveType
  country: CountryCode
}

export class LeaveTypeHelper {
  public static isCountryConsistent(leaveType: LeaveType): boolean {
    // For France, should start with "fr_"
    if (leaveType.country === 'FR') {
      return leaveType.name.startsWith('fr_')
    }

    // For Spain, should start with "es_"
    if (leaveType.country === 'ES') {
      return leaveType.name.startsWith('es_')
    }

    // For Great-Britain, should start with "uk_"
    if (leaveType.country === 'GB') {
      return leaveType.name.startsWith('uk_')
    }

    // False if another country
    return false
  }

  public static isEquals(
    leaveType1: LeaveType,
    leaveType2: LeaveType,
  ): boolean {
    return (
      leaveType1.name === leaveType2.name &&
      leaveType1.country === leaveType2.country
    )
  }
}
