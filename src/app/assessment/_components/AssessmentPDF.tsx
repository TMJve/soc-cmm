// src/app/assessment/_components/AssessmentPDF.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { type Results } from '~/lib/scoring';
import { type ProfileFormData } from './ProfileForm.schema';

// Create styles for our PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: 'grey',
    marginTop: 4,
  },
  domainSection: {
    marginBottom: 20,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  domainTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  domainScore: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  subdomainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  subdomainName: {
    flex: 1,
  },
  subdomainScore: {
    width: 40,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
});

interface AssessmentPDFProps {
  results: Results;
  profileData: ProfileFormData | null;
}

export const AssessmentPDF = ({ results, profileData }: AssessmentPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SOC Maturity Assessment Results</Text>
        <Text style={styles.subtitle}>
          For: {profileData?.names ?? 'N/A'} on {profileData?.assessmentDate ?? 'N/A'}
        </Text>
      </View>

      {/* Results Body */}
      {Object.values(results).map((domain) => (
        <View key={domain.name} style={styles.domainSection}>
          {/* Domain Header */}
          <View style={styles.domainHeader}>
            <Text style={styles.domainTitle}>{domain.name}</Text>
            <Text style={styles.domainScore}>{domain.score.toFixed(2)}</Text>
          </View>

          {/* Subdomain Rows */}
          {Object.values(domain.subdomains).map((subdomain) => (
            <View key={subdomain.name} style={styles.subdomainRow}>
              <Text style={styles.subdomainName}>{subdomain.name}</Text>
              <Text style={styles.subdomainScore}>{subdomain.score.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);