{{/*
Expand the name of the chart.
*/}}
{{- define "budgetTracker.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "budgetTracker.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "budgetTracker.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "budgetTracker.labels" -}}
helm.sh/chart: {{ include "budgetTracker.chart" . }}
{{ include "budgetTracker.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "budgetTracker.selectorLabels" -}}
app.kubernetes.io/name: {{ include "budgetTracker.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the budget tracker secret
*/}}
{{- define "budgetTracker.secretName" -}}
{{- if .Values.appSecret.create }}
{{- default (include "budgetTracker.fullname" .) .Values.appSecret.name }}
{{- else }}
{{- default "default" .Values.appSecret.name }}
{{- end }}
{{- end }}


{{/*
Prometheus labels
*/}}
{{- define "budgetTracker.labelsPrometheus" -}}
helm.sh/chart: {{ include "budgetTracker.chart" . }}
{{ include "budgetTracker.selectorLabelsPrometheus" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Grafana labels
*/}}
{{- define "budgetTracker.labelsGrafana" -}}
helm.sh/chart: {{ include "budgetTracker.chart" . }}
{{ include "budgetTracker.selectorLabelsGrafana" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels monitoring prometheus
*/}}
{{- define "budgetTracker.selectorLabelsPrometheus" -}}
app.kubernetes.io/name: {{ include "budgetTracker.name" . }}-prometheus
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Selector labels monitoring grafana
*/}}
{{- define "budgetTracker.selectorLabelsGrafana" -}}
app.kubernetes.io/name: {{ include "budgetTracker.name" . }}-grafana
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}