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
Common labels
*/}}
{{- define "budgetTracker.labelsMonitoring" -}}
helm.sh/chart: {{ include "budgetTracker.chart" . }}
{{ include "budgetTracker.selectorLabelsMonitoring" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels monitoring
*/}}
{{- define "budgetTracker.selectorLabelsMonitoring" -}}
app.kubernetes.io/name: {{ include "budgetTracker.name" . }}-monitoring
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}