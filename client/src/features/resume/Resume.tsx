import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 4, fontWeight: 'bold' },
  text: { fontSize: 12, marginBottom: 2 },
  listItem: { marginLeft: 10 },
});

const Resume = ({ data }) => (
  <Document>
    <Page style={styles.page}>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.text}>Full Name: {data.fullName}</Text>
        <Text style={styles.text}>Email: {data.email}</Text>
        <Text style={styles.text}>Phone: {data.phone}</Text>
        <Text style={styles.text}>Address: {data.address}</Text>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.heading}>Summary</Text>
        <Text style={styles.text}>{data.summary}</Text>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {data.education?.map((edu) => (
          <View key={edu._id} style={styles.listItem}>
            <Text style={styles.text}>{edu.degree} at {edu.institution}</Text>
            <Text style={styles.text}>{edu.startDate} - {edu.endDate}</Text>
            <Text style={styles.text}>{edu.description}</Text>
          </View>
        ))}
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {data.experience?.map((exp) => (
          <View key={exp._id} style={styles.listItem}>
            <Text style={styles.text}>{exp.title} at {exp.company}</Text>
            <Text style={styles.text}>{exp.startDate} - {exp.endDate}</Text>
            <Text style={styles.text}>{exp.description}</Text>
          </View>
        ))}
      </View>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          <Text style={styles.text}>{data.skills.join(", ")}</Text>
        </View>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Languages</Text>
          <Text style={styles.text}>{data.languages.join(", ")}</Text>
        </View>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Certifications</Text>
          {data.certifications.map((cert, index) => (
            <Text key={index} style={styles.text}>{cert}</Text>
          ))}
        </View>
      )}

      {/* Links */}
      {data.links?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Links</Text>
          {data.links.map((link, index) => (
            <Text key={index} style={styles.text}>{link}</Text>
          ))}
        </View>
      )}

    </Page>
  </Document>
);

export default Resume;
